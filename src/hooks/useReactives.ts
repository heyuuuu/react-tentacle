/// <reference path="../../types/types.d.ts" />

import { useState, useRef } from "react"
import { compareDeps, depthClone, mixState, replaceObject } from "../utils"

function useReactives<T extends Tentacle.OBJECT>(initState: Partial<T>, deps?: Array<keyof T>) {

	type P = Partial<T>

	// 最新状态
	const currentState = useRef<Partial<T>>({...initState})

	// 上一次状态
	const prveState = useRef<Partial<T>>(initState)

	const [state, setState] = useState(initState)

	const dispatch = (payload: Tentacle.MixState<P>) => {
		
		mixState(currentState.current, payload)

		// 检测是否有依赖需要更新
		const isUpgrade = compareDeps(currentState.current, prveState.current, deps)

		replaceObject(state, currentState.current)

		// 如果依赖中存在变动，就触发状态更新
		if(isUpgrade) {
			prveState.current = depthClone(currentState.current)
			setState({...state})
		}
	}

	return [state, dispatch, currentState.current] as [T, typeof dispatch,T]
}

export default useReactives