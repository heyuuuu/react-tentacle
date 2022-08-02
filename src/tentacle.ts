import { useEffect, useMemo, useState } from "react";
import immutable from "./immutable";
import observer from "./observer";

function clone<T extends Tentacle.Object>(data: T): T {
	return JSON.parse(JSON.stringify(data))
}

function tentacle<T extends Tentacle.Object>(initState: Partial<T>) {

	type K = keyof T

	// 克隆初始值
	const state = clone(initState as T)
	// 创建对象突变
	const { setting:insert } = immutable(state)
	// 创建监听
	const Observer = observer<T, symbol>()
	// 监听改变
	const listen = (callback: (state: T) => void, deps?: K[]) => {
		const name = Symbol("useTentacle")
		Observer.listen( prev => {
			if(deps) {
				const IsUnequal = deps.some(dep => JSON.stringify(prev[dep]) != JSON.stringify(state[dep]))
				IsUnequal && callback(state)
			} else {
				callback(state)
			}
		}, name)
		return name
	}
	// 派遣使用对象
	const dispatch = (data: Partial<T> | ((data: T) => Partial<T>)) => {
		const snapshot = clone(state)
		insert(data)
		Observer.dispatch(snapshot)
	}
	// 监听状态改变
	const useListen = (callback: (state: T) => void, deps?: K[]) => {
		useEffect(() => {
			const name = listen(callback, deps)
			return () => Observer.destroy(name)
		}, [])
	}
	// 使用触角
	const useTentacle = (deps?: K[]) => {
		const [,forceUpdate] = useState<symbol>()
		useListen(() => forceUpdate(Symbol("forceUpdate")), deps)
		return [state, dispatch, insert] as [typeof state, typeof dispatch, typeof insert]
	}
	// 还原触角状态
	const useInitTentacle = (IsDynamicUpdate?: boolean) => {
		useMemo(() => {
			if(IsDynamicUpdate) {
				dispatch(() => initState)
			} else {
				insert(() => initState)
			}
		}, [])
	}

	return {
		state,
		insert,
		listen,
		dispatch,
		useListen,
		useTentacle,
		useInitTentacle
	}
}

export default tentacle