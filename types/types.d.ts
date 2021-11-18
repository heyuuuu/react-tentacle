declare type CONSTANT = string | number | symbol

declare type OBJECT<T = unknown> = Record<CONSTANT, T>