/// <reference path="../types/types.d.ts" />

function depthCompare(value: unknown,otherValue: unknown) {
	return JSON.stringify(value) == JSON.stringify(otherValue)
}

function depthClone<T = unknown>(value: T): T {
	// 可以使用简易的递归进行优化
	return JSON.parse(JSON.stringify(value))
}

function replaceObject<T extends Tentacle.OBJECT>(target: T, other: T) {
	if(target === other) {
		return target
	}
	for(let name in target) {
		delete target[name]
	}
	return Object.assign(target, other)
}

function compareDeps<T extends Tentacle.OBJECT>(target: T, other?: T | Tentacle.CONSTANT[], deps?: Tentacle.CONSTANT[]) {
	if(deps) {
		return deps.find(k => !depthCompare(target[k], other![k]))
	} else if(other instanceof Array) {
		return other.find(k => target.hasOwnProperty(k))
	} else {
		return true
	}
}

function mixState<T extends Tentacle.OBJECT>(target: T, payload: Tentacle.MixState<T>) {
	if(payload instanceof Function) {
		replaceObject(target, payload(target))
	} else {
		if(target !== payload){
			Object.assign(target, payload)
		}
	}
	return target
}

export {
	depthClone,
	depthCompare,
	replaceObject,
	compareDeps,
	mixState
}