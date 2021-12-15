import "core-js/es/object"
import "core-js/es/symbol"
import "core-js/es/array"

import createTentacle from "./createTentacle"
import scheduler from "./scheduler"
import hooks from "./hooks"

export {
	hooks,
	scheduler,
	createTentacle
}

export default createTentacle