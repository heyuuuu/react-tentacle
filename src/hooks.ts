/// <reference path="../types/types.d.ts" />

import { useMemo, useReducer, useState } from "react"
import cloneDeep from "lodash.clonedeep"
import isEqual from "lodash.isequal"
import createUniqueId from "lodash.uniqueid"
import immutable from "./immutable"

export function useReactive<T extends Tentacle.OBJECT>(initState: Partial<T>, deps?: (keyof T)[]) {
    const [uniqueId, setUniqueId] = useState("")
    const {state, mutation} = useMemo(() => immutable(initState as T), [])
    const reaction = () => setUniqueId(createUniqueId("reactive-id-"))
    const reactive = (payload: ((state: T) => Partial<T>) | Partial<T>) => {
        if(deps) {
            const snapshot = cloneDeep(state)
            mutation(payload)
            const IsUnequal = deps.some(dep => !isEqual(snapshot[dep], state[dep]))
            IsUnequal && reaction()
        } else {
            mutation(payload)
            reaction()
        }
    }
    return {
        state,
        uniqueId,
        mutation,
        reaction,
        reactive,
    }
}

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