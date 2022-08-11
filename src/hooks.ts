/// <reference path="../types/types.d.ts" />

import { useMemo, useState } from "react"
import cloneDeep from "lodash.clonedeep"
import isEqual from "lodash.isequal"
import immutable from "./immutable"

export function useReactives<T extends Tentacle.Object>(raw: Partial<T>, deps?: (keyof T)[]) {
    const { mutation } = useMemo(() => immutable(raw as T), [])
    const [state, setState] = useState(() => cloneDeep(raw))
    const reaction = () => setState(cloneDeep(raw))
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