declare namespace Tentacle {
	type CONSTANT = string | number | symbol

	interface OBJECT<T = unknown> {
		[name: CONSTANT]: T
	}
	
	type MixState<P> = P | ((state: P) => P)
}