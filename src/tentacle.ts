import { useEffect, useMemo } from "react";
import immutable from "./immutable";
import observer from "./observer";
import isEqual from "lodash.isequal"
import cloneDeep from "lodash.clonedeep"
import { useReactives } from "./hooks"

function tentacle<T extends Tentacle.Object>(initState: Partial<T>) {

	type K = keyof T

	// 克隆初始值
	const state = cloneDeep(initState as T)
	// 创建对象突变
	const { mutation } = immutable(state)
	// 创建监听
	const Observer = observer<T, symbol>()
	// 监听改变
	const listen = (callback: (state: T) => void, deps?: K[]) => {
		const name = Symbol("useTentacle")
		Observer.listen(oldState => {
			if(deps) {
				const IsUnequal = deps.some(dep => !isEqual(oldState[dep], state[dep]))
				IsUnequal && callback(state)
			} else {
				callback(state)
			}
		}, name)
		return name
	}
	// 改变属性并触发反应
	const reactive = (data: Partial<T> | ((data: T) => Partial<T>)) => {
		const snapshot = cloneDeep(state)
		mutation(data)
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
		const { raw, state: data, reaction } = useReactives(state)
		useListen(reaction, deps)
		return {raw, state: data, mutation, reactive }
	}
	// 还原触角状态
	const useInitTentacle = (IsDynamicUpdate?: boolean) => {
		useMemo(() => {
			if(IsDynamicUpdate) {
				reactive(() => initState)
			} else {
				mutation(() => initState)
			}
		}, [])
	}

	return {
		state,
		listen,
		mutation,
		reactive,
		useListen,
		useTentacle,
		useInitTentacle
	}
}

export default tentacle