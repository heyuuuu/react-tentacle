import { useEffect } from "react"
import scheduler from "./scheduler"
import hooks from "./hooks"
import { depthClone, mixState } from "./utils"

type Callback<T> = (state: Partial<T>) => void

function createTentacle<T extends OBJECT>(currentState: Partial<T>) {

	type P = Partial<T>
	type K = keyof T

	const initState: P = depthClone(currentState)

	const nextState: P = currentState

	const fiber = scheduler<T>(nextState)

	const dispatch = (action: MixState<P>) =>  {
		mixState(nextState, action)
		fiber.dispatch(nextState)
	}

	function subscribe(callback: Callback<T>, deps?: K[]) {
		const handleName = fiber.subscribe(callback, { deps })
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

		const [state, setState] = hooks.useReactives(nextState)

		useListen(states => setState(() => states), deps)

		return [state, dispatch, nextState] as [T, typeof dispatch, T]
	}

	// 恢复状态(消除副作用)
	function destroy() {
		dispatch(() => depthClone(initState))
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