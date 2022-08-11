function observer<T, P extends Tentacle.CONSTANT>() {

	type Callback = (data: T) => void

	const listenMap = new Map<P, Callback>()
	
	const dispatch = (data: T) => {
		listenMap.forEach(callback => callback(data))
	}
	const listen = (callback: Callback, name: P) => {
		listenMap.set(name, callback)
	}
	const destroy = (name: P) => {
		listenMap.delete(name)
	}

	return {
		listen,
		destroy,
		dispatch,
	}
}

export default observer