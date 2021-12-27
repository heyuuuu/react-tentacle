import { useLayoutEffect , useEffect, useState } from "react"

function useAnimation(before: string | string[], after: string | string[], visible?: boolean) {

    const [dynamicStyles, setDynamicStyles] = useState(before)

    useLayoutEffect(() => {
        setDynamicStyles(before)
    }, [visible])

    useEffect(() => {
        if(visible !== false ) {
            setDynamicStyles(after)
        }
    }, [visible])

    return dynamicStyles
}

export default useAnimation