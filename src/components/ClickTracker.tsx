"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useRef } from "react"
import { trackClick } from "@/app/actions/tracking"

export function ClickTracker() {
    const searchParams = useSearchParams()
    const ref = searchParams.get("ref")
    const tracked = useRef(false)

    useEffect(() => {
        if (ref && !tracked.current) {
            tracked.current = true
            // Fire and forget
            trackClick(ref)
        }
    }, [ref])

    return null
}
