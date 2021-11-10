import { useState, useRef } from "react"

function useReactives<T extends OBJECT>(initState: T, deps?: Array<keyof T>) {

	const currentState = useRef<T>(initState)

	const [state, setState] = useState(currentState.current)

	// 判断是否有相关依赖需要更新状态
	const IsUpgrade = (nextState: Partial<T>) => {
		if(deps) {
			const result = deps.find(name => name in nextState)
			return result ? true : false
		}else {
			return true
		}
	}

	const updateState = (nextState: Partial<T>) => {
		const isUpgrade = IsUpgrade(nextState)
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