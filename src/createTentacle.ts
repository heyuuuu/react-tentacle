import { useEffect } from "react"
import scheduler from "./scheduler"
import hooks from "./hooks"
import { depthCompare, depthClone, isMatch } from "./utils"

type State = Record<string, unknown>

type Callback<T> = (state: Partial<T>) => void

function createTentacle<T extends State, K extends keyof T>(currentState: T) {

	const initState: T = depthClone(currentState)

	const fiber = scheduler(currentState)

	const dispatch = (action: Partial<T> | ((state: T) => T)) =>  {
		// 处理下一个状态
		const nextState = action instanceof Function ? action(initState) : <T>action
		// 合并到全局副本状态中
		Object.assign(initState, nextState)
		// 向所有订阅者推送状态
		fiber.dispatch(nextState)
	}

	function subscribe(callback: Callback<T>, deps?: K[]) {
		const handleName = fiber.subscribe(callback, deps)
		return handleName
	}

	function unSubscribe(name: symbol) {
		fiber.unSubscribe(name)
	}

	function useListen(callback: Callback<T>, deps?: K[]) {
		useEffect(() => {
			const handleName = subscribe(callback, deps)
			return () => {
				unSubscribe(handleName)
			}
		}, [])
	}

	function useTentacles(deps?: K[]) {

		const [state, setState] = hooks.useReactives({...initState}, deps)

		useListen(state => setState(state), deps)

		return <[T, Callback<T>, T]>[state, dispatch, initState]
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