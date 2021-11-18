import { useState, useEffect } from "react"
import scheduler from "./scheduler"
import hooks from "./hooks"
import { depthCompare, depthClone } from "./utils"

type State = Record<string, unknown>

function createTentacle<T extends State, K extends keyof T>(currentState: T) {

	const initState: T = depthClone(currentState)

	const fiber = scheduler(initState)

	const dispatch = (action: Partial<T> | ((state: T) => T)) =>  {
		if(action instanceof Function) {
			fiber.dispatch(action(initState))
		} else {
			fiber.dispatch(<T>action)
		}
	}

	function subscribe(callback: (state: T) => void, deps?: K[]) {
		const handleName = fiber.subscribe((nextState, prevState) => {
			// 比较状态是否一致
			const IsOverlap = deps?.find(name => !depthCompare(nextState[name], prevState[name]))
			// 同步全局状态
			Object.assign(initState, nextState)
			// 是否需要同步全部状态
			if(IsOverlap) {
				// 通过包裹state来重新render
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

		const [state, setState] = hooks.useReactives(initState)

		useListen(state => setState(state), deps)

		return <[T, (state: Partial<T>) => void, T]>[state, dispatch, initState]
	}

	// 恢复状态
	function destroy() {
		const state = depthClone(currentState)
		dispatch(state)
	}

	return {
		state: initState,
		destroy,
		dispatch,
		useListen,
		subscribe,
		unSubscribe,
		useTentacles,
	}
}

export default createTentacle