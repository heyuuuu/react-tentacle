import { useState, useRef } from "react"
import { depthCompare, isMatch } from "./utils"

function useReactives<T extends OBJECT>(initState: T, deps?: Array<keyof T>) {

	const currentState = useRef<T>(initState)

	const [state, setState] = useState(currentState.current)

	const updateState = (nextState: Partial<T>) => {
		const isUpgrade = isMatch(name => !depthCompare(nextState[<string>name], state[<string>name]), deps)
		// 同步到状态中
		Object.assign(currentState.current, nextState)
		// 如果依赖中存在变动，就触发状态更新
		if(isUpgrade) {
			setState({...currentState.current})
		}
	}

	return <[T, typeof updateState, T]>[state, updateState, currentState.current]
}

export default {
	useReactives
}