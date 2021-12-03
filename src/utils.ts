function depthCompare(value: unknown,otherValue: unknown) {
	return JSON.stringify(value) == JSON.stringify(otherValue)
}

function depthClone(value: unknown) {
	return JSON.parse(JSON.stringify(value))
}

function isMatch<T extends OBJECT, K extends keyof T>(payload: T | ((name: K) => boolean), deps?: K[]) {
	if(deps) {
		const findDep = deps.find(name => {
			if(payload instanceof Function) {
				return payload(name)
			} else if(name){
				return payload.hasOwnProperty(name)
			}
		})
		return Boolean(findDep)
	} else {
		return true
	}
}

export default {
	isMatch,
	depthClone,
	depthCompare
}

export {
	isMatch,
	depthClone,
	depthCompare
}