/// <reference path="../../types/types.d.ts" />

import { useState, useMemo, useRef } from "react"
import { compareDeps, depthClone, mixState, replaceObject } from "../utils"

function useReactives<T extends Tentacle.OBJECT>(initState: Partial<T>, deps?: Array<keyof T>) {

	type P = Partial<T>

	// 记录当前状态
	const currentState = useRef<Partial<T>>({})

	const linkState = useMemo(() => {
		currentState.current = depthClone(initState)
		return initState
	}, [])

	const [state, setState] = useState(linkState)

	const dispatch = (payload: Tentacle.MixState<P>) => {
		
		mixState(state, payload)

		// 检测是否有依赖需要更新
		const isUpgrade = compareDeps(state, currentState.current, deps)

		replaceObject(linkState, state)

		// 如果依赖中存在变动，就触发状态更新
		if(isUpgrade) {
			currentState.current = depthClone(state)
			setState({...state})
		}
	}

	return [state, dispatch, linkState] as [T, typeof dispatch,T]
}

export default useReactives