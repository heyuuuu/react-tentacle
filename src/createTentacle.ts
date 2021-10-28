import { useState, useEffect } from "react"
import scheduler from "./scheduler"
import { depthCompare } from "./utils"

type State = Record<string, unknown>

function createTentacle<T extends State, K extends keyof T>(currentState: T) {

	const initState: T = JSON.parse(JSON.stringify(currentState))

	const fiber = scheduler(initState)

	const dispatch = (action: Partial<T> | ((state: T) => T)) =>  {
		if(action instanceof Function) {
			fiber.dispatch(action(initState))
		} else {
			fiber.dispatch(<T>action)
		}
	}

	function subscribe(callback: (state: T) => void, deps?: K[]) {
		const handleName = fiber.subscribe(nextState => {
			if(deps) {
				// 比较状态是否一致
				const IsOverlap = deps.find(name => !depthCompare(nextState[name], initState[name]))
				// 同步全局状态
				Object.assign(initState, nextState)
				if(IsOverlap) {
					// 通过包裹state来重新render
					callback(initState)
				}
			}else {
				Object.assign(initState, nextState)
				callback(initState)
			}

		}, deps)
		return handleName
	}

	function unSubscribe(name: symbol) {
		fiber.unSubscribe(name)
	}

	function useListen(callback: (state: T) => void, deps?: K[]) {
		useEffect(() => {
			const handleName = subscribe(callback, deps)
			return () => {
				fiber.unSubscribe(handleName)
			}
		}, [])
	}

	function useTentacles(deps?: K[]) {

		const [state, setState] = useState(initState)

		useListen(state => setState({...state}), deps)

		return state
	}

	// 恢复状态
	function resetState() {
		const state = JSON.parse(JSON.stringify(currentState))
		dispatch(state)
	}

	return {
		state: initState,
		dispatch,
		useListen,
		subscribe,
		resetState,
		unSubscribe,
		useTentacles,
	}
}

export default createTentacle