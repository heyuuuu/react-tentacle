type Callback<T> = (state: T) => void

type ListItem<T> = {
	name: symbol
	deps?: Array<keyof T>
	callback: Callback<T>
}

type State = Record<string, unknown>

// 调度器(订阅发布中心)
class Scheduler<T extends State, K extends keyof T>{

	private state = <T>{}

	private list: ListItem<T>[] = []

	constructor(state: T) {
		this.state = state
	}

	// 执行调度
	private handleAction(item: ListItem<T>) {
		// 是否有相关依赖数组
		if(item.deps) {
			// 判断相关依赖是否更新
			if(item.deps.find(k => k in this.state)) {
				item.callback(this.state)
			}
		}else {
			item.callback(this.state)
		}
	}

	// 处理调度任务
	private triggerAction() {
		this.list.forEach(item => this.handleAction(item))
	}

	// 触发调度任务
	public dispatch(state: T) {
		this.state = state
		this.triggerAction()
	}

	// 向队列添加一个调度器
	public subscribe(callback: Callback<T>, deps?: K[]) {
		// 给每一个订阅器创建一个唯一的名称
		const stamp = new Date().valueOf()
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

export default function scheduler<T extends State>(state: T) {
	return new Scheduler(state)
}