function depthCompare(value: unknown,otherValue: unknown) {
	return JSON.stringify(value) == JSON.stringify(otherValue)
}

function depthClone(value: unknown) {
	return JSON.parse(JSON.stringify(value))
}

export default {
	depthClone,
	depthCompare
}

export {
	depthClone,
	depthCompare
}