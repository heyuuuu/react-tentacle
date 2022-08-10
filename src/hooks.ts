/// <reference path="../types/types.d.ts" />

import { useMemo, useState } from "react"
import immutable from "./immutable"

export function useForceUpdate() {
    const [ seal, setSeal] = useState<symbol>()
    const forceUpdate = () => setSeal(Symbol("forceUpdate"))
    return [forceUpdate, seal] as [typeof forceUpdate, typeof seal]
}

export function useReactives<T extends Tentacle.Object>(state: Partial<T>, deps?: (keyof T)[]) {
    const { mutation, state: raw } = useMemo(() => immutable(state as T), [])
    const [ forceUpdate, seal ] = useForceUpdate()
    const reactive = (payload: ((state: T) => Partial<T>) | Partial<T>) => {
        if(deps) {
            const prev = JSON.parse(JSON.stringify(raw))
            mutation(payload)
            const IsUnequal = deps.some(dep => JSON.stringify(prev[dep]) != JSON.stringify(raw[dep]))
            IsUnequal && forceUpdate()
        } else {
            mutation(payload)
            forceUpdate()
        }
    }
    return {
        seal,
        state,
        reactive,
        mutation,
        forceUpdate
    }
}