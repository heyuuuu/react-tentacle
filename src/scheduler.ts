import { depthClone, compareDeps, mixState } from "./utils"

type Callback<T> = (nextState: T) => void

interface Options<K = unknown> {
	deps?: K[] // 依赖项
}

type ListItem<P, K> = {
	name: symbol
	prveState?: P
	options?: Options<K>
	callback: Callback<P>
}

// 调度器(订阅发布中心)
function scheduler<T extends Tentacle.OBJECT>(state: Partial<T> = {}) {

	type K = keyof T
	type P = Partial<T>
	type Item = ListItem<P, K>

	// 数据交换
	const DataFlow: {
		nextState: P // 下一个调度状态
		list: Item[] // 监听队列
	} = {
		nextState: state,
		list: []
	}

	// 执行调度
	function handleAction(item: Item) {
		const { options, callback, prveState = {} } = item
		// 是否有相关依赖数组
		if(options?.deps) {
			const IsChange = compareDeps(prveState, DataFlow.nextState, options.deps)
			if(IsChange) {
				item.prveState = depthClone(DataFlow.nextState)
				callback(item.prveState)
			}
		} else {
			callback(DataFlow.nextState)
		}
	}

	// 处理调度任务
	function triggerAction() {
		DataFlow.list.forEach(item => handleAction(item))
	}

	// 触发调度任务
	function dispatch(state: Tentacle.MixState<P>) {
		mixState(DataFlow.nextState, state)
		triggerAction()
	}

	// 向队列添加一个调度器
	function subscribe(callback: Callback<P>, options?: Options<K>) {
		const stamp = new Date().valueOf()
		// 给每一个订阅器创建一个唯一的名称
		const name = Symbol(stamp)
		const item = {
			name,
			options,
			callback
		}
		// 将调度器添加到队列中
		DataFlow.list.push(item)
		// 执行一次调度器
		handleAction(item)
		// 返回调度名称
		return name
	}

	// 移除调度器
	function unSubscribe(name: symbol) {
		DataFlow.list = DataFlow.list.filter(item => item.name !== name)
	}

	return {
		dispatch,
		subscribe,
		unSubscribe
	}
}

export default scheduler