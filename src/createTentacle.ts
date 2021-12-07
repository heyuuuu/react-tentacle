import { useEffect } from "react"
import scheduler from "./scheduler"
import hooks from "./hooks"
import { depthClone } from "./utils"

type Callback<T> = (state: Partial<T>) => void

function createTentacle<T extends OBJECT>(currentState: Partial<T>) {

	type P = Partial<T>
	type K = keyof T

	const initState: P = depthClone(currentState)

	const fiber = scheduler<T>(currentState)

	const dispatch = (action: P | ((state: P) => P)) =>  {
		// 处理下一个状态
		if(action instanceof Function) {
			// 下一个状态
			const nextState = action(initState)
			// 合并状态
			Object.assign(initState, nextState)
			// 替换状态
			for(let name in initState) {
				initState[name] = nextState[name]
			}
			// 向所有订阅者推送状态
			fiber.dispatch(initState)
		} else {
			// 合并到全局副本状态中
			Object.assign(initState, action)
			// 向所有订阅者推送状态
			fiber.dispatch(action)
		}
	}

	function subscribe(callback: Callback<T>, deps?: K[]) {
		const handleName = fiber.subscribe(callback, deps)
		return handleName
	}

	function unSubscribe(name: symbol) {
		fiber.unSubscribe(name)
	}

	function useListen(callback: Callback<P>, deps?: K[]) {
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

		return <[T, typeof dispatch, T]>[state, dispatch, initState]
	}

	// 恢复状态(消除副作用)
	function destroy() {
		const state = depthClone(currentState)
		dispatch(() => state)
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