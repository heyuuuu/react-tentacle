/// <reference path="../types/types.d.ts" />

import { useEffect } from "react"
import scheduler from "./scheduler"
import hooks from "./hooks"
import { depthClone, mixState } from "./utils"

type Callback<T> = (state: Partial<T>) => void

function createTentacle<T extends Tentacle.OBJECT>(currentState: Partial<T>) {

	type P = Partial<T>
	type K = keyof T

	const initState: P = depthClone(currentState)

	const nextState: P = currentState

	const fiber = scheduler<T>(nextState)

	const dispatch = (action: Tentacle.MixState<P>) =>  {
		mixState(nextState, action)
		fiber.dispatch(nextState)
	}

	function subscribe(callback: Callback<P>, deps?: K[]) {
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

		const [state, setState, linkState] = hooks.useReactives(nextState)

		useListen(nextState => setState(() => nextState), deps)

		return [state, dispatch, linkState] as [T, typeof dispatch, T]
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