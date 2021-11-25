function depthCompare(value: unknown,otherValue: unknown) {
	return JSON.stringify(value) == JSON.stringify(otherValue)
}

function depthClone(value: unknown) {
	return JSON.parse(JSON.stringify(value))
}

function isMatch(payload: OBJECT | ((name: CONSTANT) => boolean), deps?: CONSTANT[]) {
	return deps ? Boolean(deps.find(name => {
		if(payload instanceof Function) {
			return payload(name)
		} else {
			return payload.hasOwnProperty(name)
		}
	})) : true
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