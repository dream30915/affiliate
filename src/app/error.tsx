"use client"

import { Button } from "@/components/ui/button"

export default function Error({
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <div className="flex min-h-screen items-center justify-center px-4">
            <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-slate-800">Something went wrong</h2>
                <p className="text-slate-500">An unexpected error occurred. Please try again.</p>
                <Button onClick={reset}>Try again</Button>
            </div>
        </div>
    )
}
