/// <reference path="../types/types.d.ts" />

import { useMemo, useState } from "react"
import immutable from "./immutable"

export function useReactives<T extends Tentacle.Object>(state: Partial<T>, deps?: (keyof T)[]) {
    const { setting, keepData } = useMemo(() => immutable(state as T), [])
    const [, forceUpdate] = useState<symbol>()
    const dispatch = (payload: ((state: T) => Partial<T>) | Partial<T>) => {
        if(deps) {
            const prev = JSON.parse(JSON.stringify(keepData))
            setting(payload)
            const IsUnequal = deps.some(dep => JSON.stringify(prev[dep]) != JSON.stringify(keepData[dep]))
            IsUnequal && forceUpdate(Symbol("useReactives"))
        } else {
            setting(payload)
            forceUpdate(Symbol("useReactives"))
        }
    }
    return [keepData, dispatch, setting] as [typeof keepData, typeof dispatch, typeof setting]
}