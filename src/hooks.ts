import { useState, useRef, useCallback, useMemo } from "react"
import { depthCompare, isMatch } from "./utils"

function useReactives<T extends OBJECT>(initState: Partial<T>, deps?: Array<keyof T>) {

	type P = Partial<T>

	// 同步所有状态
	const nextState = useRef<P>(initState)
	
	// 记录当前状态
	const currentState = useRef<P>(initState)

	const [state, setState] = useState({...initState})

	// 同步备份当前状态
	currentState.current = useMemo(() => state, [state])

	const dispatch = (payload: P | ((state: P) => P)) => {
		// 处理下一个状态值
		const state = payload instanceof Function ? payload(nextState.current) : payload
		// 如果传入的是函数，那么将返回全新的状态
		if(payload instanceof Function) {
			for(let name in nextState.current) {
				delete nextState.current[name]
			}
		}
		// 检测是否有依赖需要更新
		const isUpgrade = isMatch(name => !depthCompare(state[name], currentState.current[name]), deps)
		// 同步到状态中
		Object.assign(nextState.current, state)
		// 如果依赖中存在变动，就触发状态更新
		if(isUpgrade) {
			setState({...nextState.current})
		}
	}

	return <[T, typeof dispatch, T]>[state, dispatch, nextState.current]
}

export default {
	useReactives
}