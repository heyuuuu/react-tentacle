import { useEffect } from "react"
import scheduler from "./scheduler"
import hooks from "./hooks"
import { depthClone, replaceObject } from "./utils"

type Callback<T> = (state: Partial<T>) => void

function createTentacle<T extends OBJECT>(currentState: Partial<T>) {

	type P = Partial<T>
	type K = keyof T

	const nextState: P = depthClone(currentState)

	const fiber = scheduler<T>(currentState)

	const dispatch = (action: P | ((state: P) => P)) =>  {
		if(action instanceof Function) {
			replaceObject(nextState, action(nextState))
			fiber.dispatch(() => nextState)
		} else {
			Object.assign(nextState, action)
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

		const [state, setState] = hooks.useReactives(nextState, deps)

		useListen(state => setState(state), deps)

		return <[T, typeof dispatch, T]>[state, dispatch, nextState]
	}

	// 恢复状态(消除副作用)
	function destroy() {
		const state = depthClone(currentState)
		dispatch(() => state)
	}

	return {
		state: nextState,
		destroy,
		dispatch,
		useListen,
		subscribe,
		unSubscribe,
		useTentacles,
	}
}

export default createTentacle