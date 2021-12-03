import { useState, useRef } from "react"
import { depthCompare, isMatch } from "./utils"

function useReactives<T extends OBJECT>(initState: Partial<T>, deps?: Array<keyof T>) {

	type P = Partial<T>

	const currentState = useRef<P>(initState)

	const [state, setState] = useState({...currentState.current})

	const dispatch = (payload: P | ((state: P) => P)) => {
		// 处理下一个状态值
		const nextState = payload instanceof Function ? payload(currentState.current) : payload
		// 如果传入的是函数，那么将返回全新的状态
		if(payload instanceof Function) {
			for(let name in currentState.current) {
				delete currentState.current[name]
			}
		}
		// 检测是否有依赖需要更新
		const isUpgrade = isMatch(name => !depthCompare(nextState[name], state[name]), deps)
		// 同步到状态中
		Object.assign(currentState.current, nextState)
		// 如果依赖中存在变动，就触发状态更新
		if(isUpgrade) {
			setState({...currentState.current})
		}
	}

	return <[T, typeof dispatch, T]>[state, dispatch, currentState.current]
}

export default {
	useReactives
}