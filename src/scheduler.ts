import { depthClone, isMatch } from "./utils"

type Callback<T> = (nextState: T) => void

type ListItem<T, K> = {
	name: symbol
	deps?: K
	callback: Callback<T>
}

// 调度器(订阅发布中心)
class Scheduler<
	T extends OBJECT,
	P = Partial<T>,
	K = keyof T[]
>{

	private nextState = <P>{}

	private list: ListItem<P, K>[] = []

	constructor(state: T | P) {
		this.nextState = depthClone(state)
	}

	// 执行调度
	private handleAction(item: ListItem<P, K>) {
		// 是否有相关依赖数组
		if(isMatch(<any>this.nextState, <any>item.deps)) {
			item.callback(this.nextState)
		}
	}

	// 处理调度任务
	private triggerAction() {
		this.list.forEach(item => this.handleAction(item))
	}

	// 触发调度任务
	public dispatch(state: P) {
		this.nextState = state
		this.triggerAction()
	}

	// 向队列添加一个调度器
	public subscribe(callback: Callback<P>, deps?: K) {
		const stamp = new Date().valueOf()
		// 给每一个订阅器创建一个唯一的名称
		const name = Symbol(stamp)
		const item = {
			name,
			deps,
			callback
		}
		// 将调度器添加到队列中
		this.list.push(item)
		// 执行一次调度器
		this.handleAction(item)
		// 返回调度名称
		return name
	}

	// 移除调度器
	public unSubscribe(name: symbol) {
		this.list = this.list.filter(item => item.name !== name)
	}
}

export default function scheduler<T extends OBJECT, P = Partial<T>>(state: T | P) {
	return new Scheduler<T,P>(state)
}