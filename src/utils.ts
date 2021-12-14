function depthCompare(value: unknown,otherValue: unknown) {
	return JSON.stringify(value) == JSON.stringify(otherValue)
}

function depthClone(value: unknown) {
	return JSON.parse(JSON.stringify(value))
}

function replaceObject<T extends OBJECT>(target: T, other: T) {
	if(target === other) {
		return target
	}
	for(let name in target) {
		delete target[name]
	}
	return Object.assign(target, other)
}

function compareDeps<T extends OBJECT>(target: T, other?: T | CONSTANT[], deps?: CONSTANT[]) {
	if(deps) {
		return deps.find(k => !depthCompare(target[k], other![k]))
	} else if(other instanceof Array) {
		return other.find(k => target.hasOwnProperty(k))
	} else {
		return true
	}
}

export {
	depthClone,
	depthCompare,
	replaceObject,
	compareDeps
}