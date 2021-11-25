import { useEffect } from "react"
import scheduler from "./scheduler"
import hooks from "./hooks"
import { depthClone } from "./utils"

type Callback<T> = (state: Partial<T>) => void

function createTentacle<T extends OBJECT,P = Partial<T>, K = keyof T>(currentState: T | P) {

	const initState: T = depthClone(currentState)

	const fiber = scheduler<T>(currentState)

	const dispatch = (action: P | ((state: T) => T)) =>  {
		// 处理下一个状态
		const nextState = action instanceof Function ? action(initState) : <P>action
		// 合并到全局副本状态中
		Object.assign(initState, nextState)
		// 向所有订阅者推送状态
		fiber.dispatch(nextState)
	}

	function subscribe(callback: Callback<T>, deps?: K[]) {
		const handleName = fiber.subscribe(callback, <any>deps)
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

		const [state, setState] = hooks.useReactives({...initState}, <any>deps)

		useListen(state => setState(state), deps)

		return <[T, Callback<T>, T]>[state, dispatch, initState]
	}

	// 恢复状态(消除副作用)
	function destroy() {
		const state = depthClone(currentState)
		for(let name in initState) {
			delete initState[name]
		}
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