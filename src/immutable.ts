function immutable<T extends Tentacle.Object>(state: T) {
	const clean = (name?: (keyof T)[]) => {
		if(name) {
			name.forEach(k => delete state[k])
		} else {
			Object.keys(state).forEach(k => delete state[k])
		}
	}
	const mutation = (payload: Partial<T> | ((data: T) => Partial<T>)) => {
		if(payload instanceof Function) {
			const next = payload(state)
			if(next !== state) {
				clean()
				Object.assign(state, next)
			}
		} else {
			Object.assign(state, payload)
		}
		return state
	}
	return {
		state,
		clean,
		mutation
	}
}

export default immutable