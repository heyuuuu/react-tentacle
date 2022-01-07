/// <reference path="../../types/types.d.ts" />

import { useState, useMemo } from "react"
import { compareDeps, depthClone, mixState, replaceObject } from "../utils"

function useReactives<T extends Tentacle.OBJECT>(initState: Partial<T>, deps?: Array<keyof T>) {

	type P = Partial<T>

	const linkState = useMemo(() => initState, [])

	const [state, setState] = useState(linkState)

	// 记录当前状态
	const currentState = useMemo(() => depthClone(state), [state])

	const dispatch = (payload: Tentacle.MixState<P>) => {
		
		mixState(state, payload)

		// 检测是否有依赖需要更新
		const isUpgrade = compareDeps(state, currentState, deps)

		replaceObject(linkState, state)

		// 如果依赖中存在变动，就触发状态更新
		if(isUpgrade) {
			setState({...state})
		}
	}

	return [state, dispatch, linkState] as [T, typeof dispatch,T]
}

export default useReactives