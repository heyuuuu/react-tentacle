/// <reference path="../types/types.d.ts" />

import { useMemo, useReducer } from "react"
import cloneDeep from "lodash.clonedeep"
import isEqual from "lodash.isequal"
import immutable from "./immutable"

export function useReactives<T extends Tentacle.OBJECT>(initState: Partial<T>, deps?: (keyof T)[]) {
    const {state:raw, mutation} = useMemo(() => immutable(initState as T), [])
    const [state, reaction] = useReducer(() => cloneDeep(raw), raw, cloneDeep)
    const reactive = (payload: ((state: T) => Partial<T>) | Partial<T>) => {
        if(deps) {
            const snapshot = cloneDeep(raw)
            mutation(payload)
            const IsUnequal = deps.some(dep => !isEqual(snapshot[dep], raw[dep]))
            IsUnequal && reaction()
        } else {
            mutation(payload)
            reaction()
        }
    }
    return {
        raw,
        state,
        mutation,
        reaction,
        reactive,
    }
}