function depthCompare(value: unknown,otherValue: unknown) {
	return JSON.stringify(value) == JSON.stringify(otherValue)
}

export default {
	depthCompare
}

export {
	depthCompare
}