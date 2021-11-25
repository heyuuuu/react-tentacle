declare type CONSTANT = string | number | symbol

declare interface OBJECT<T = unknown> {
	[name: CONSTANT]: T
}