import { useState, useRef, useCallback, useMemo } from "react"
import { replaceObject, compareDeps } from "./utils"

function useReactives<T extends OBJECT>(initState: Partial<T>, deps?: Array<keyof T>) {

	type P = Partial<T>

	// 同步所有状态
	const nextState = useRef<P>(initState)
	
	// 记录当前状态
	const middleState = useRef<P>({...initState})

	const [state, setState] = useState(middleState.current)

	const dispatch = (payload: P | ((state: P) => P)) => {

		if(payload instanceof Function) {
			replaceObject(nextState.current, payload(nextState.current))
		} else {
			Object.assign(nextState.current, payload)
		}
		// 检测是否有依赖需要更新
		const isUpgrade = compareDeps(nextState.current, middleState.current, deps)
		// 如果依赖中存在变动，就触发状态更新
		if(isUpgrade) {
			middleState.current = {...nextState.current}
			setState(middleState.current)
		}
	}

	return <[T, typeof dispatch, T]>[state, dispatch, nextState.current]
}

export default {
	useReactives
}