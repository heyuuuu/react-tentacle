function immutable<T extends Tentacle.Object>(keepData = {} as T) {
	const clear = (name?: (keyof T)[]) => {
		if(name) {
			name.forEach(k => delete keepData[k])
		} else {
			Object.keys(keepData).forEach(k => delete keepData[k])
		}
	}
	const setting = (payload: Partial<T> | ((data: T) => Partial<T>)) => {
		if(payload instanceof Function) {
			const next = payload(keepData)
			if(next !== keepData) {
				clear()
				Object.assign(keepData, next)
			}
		} else {
			Object.assign(keepData, payload)
		}
		return keepData
	}
	return {
		clear,
		setting,
		keepData
	}
}

export default immutable