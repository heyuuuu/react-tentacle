import { depthClone, compareDeps } from "./utils"

type Callback<T> = (nextState: T) => void

type ListItem<T, K> = {
	name: symbol
	deps?: K
	callback: Callback<T>
}

// 调度器(订阅发布中心)
function scheduler<T extends OBJECT>(state: Partial<T> = {}) {

	type K = keyof T
	type P = Partial<T>

	// 数据交换
	const DataFlow: {
		nextState: P // 下一个调度状态
		deps?: K[]
		list: ListItem<P, K[]>[] // 监听队列
	} = {
		nextState: depthClone(state),
		list: []
	}

	// 执行调度
	function handleAction(item: ListItem<P, K[]>) {
		// 是否有相关依赖数组
		if(item.deps && DataFlow.deps) {
			const matchDeps = item.deps.find(name => DataFlow.deps!.indexOf(name) > -1)
			if(matchDeps) {
				item.callback(DataFlow.nextState)
			}
		} else {
			item.callback(DataFlow.nextState)
		}
	}

	// 处理调度任务
	function triggerAction() {
		DataFlow.list.forEach(item => handleAction(item))
	}

	// 触发调度任务
	function dispatch(state: P, deps?: K[]) {
		DataFlow.nextState = state
		DataFlow.deps = deps
		triggerAction()
	}

	// 向队列添加一个调度器
	function subscribe(callback: Callback<P>, deps?: K[]) {
		const stamp = new Date().valueOf()
		// 给每一个订阅器创建一个唯一的名称
		const name = Symbol(stamp)
		const item = {
			name,
			deps,
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