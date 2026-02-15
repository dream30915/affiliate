"use client"

import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, Lock, CheckCircle, Sparkles } from "lucide-react"

function ResetPasswordForm() {
    const searchParams = useSearchParams()
    const token = searchParams.get("token") || ""

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        if (!token) {
            setError("Invalid reset link. Please request a new one.")
            return
        }

        setLoading(true)

        try {
            const res = await fetch("/api/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            })

            if (res.ok) {
                setSuccess(true)
            } else {
                const data = await res.json()
                setError(data.message || "Something went wrong")
            }
        } catch {
            setError("An unexpected error occurred")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    {success ? "Password reset!" : "Set new password"}
                </h1>
                <p className="text-slate-500 mt-1.5 text-sm">
                    {success
                        ? "Your password has been successfully reset."
                        : "Enter your new password below."
                    }
                </p>
            </div>

            {!success ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium text-slate-700">New Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Min 8 chars, A-Z, a-z, 0-9"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                            className="h-11 rounded-xl bg-white border-slate-200 focus:border-primary focus:ring-primary/20"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">Confirm Password</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Re-enter your new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={8}
                            className="h-11 rounded-xl bg-white border-slate-200 focus:border-primary focus:ring-primary/20"
                        />
                    </div>

                    {error && (
                        <div className="text-sm text-red-500 bg-red-50 border border-red-100 px-4 py-2.5 rounded-xl">
                            {error}
                        </div>
                    )}

                    <Button className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 font-semibold shadow-lg shadow-primary/20" type="submit" disabled={loading}>
                        <Lock className="mr-2 h-4 w-4" />
                        {loading ? "Resetting..." : "Reset Password"}
                    </Button>
                </form>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center space-y-4">
                    <div className="h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                        <CheckCircle className="h-7 w-7" />
                    </div>
                    <p className="text-sm text-slate-500">
                        You can now sign in with your new password.
                    </p>
                    <Link href="/login">
                        <Button className="h-11 rounded-xl bg-primary hover:bg-primary/90 font-semibold shadow-lg shadow-primary/20">
                            Go to Sign In
                        </Button>
                    </Link>
                </div>
            )}

            <Link href="/login" className="flex items-center gap-2 text-sm text-slate-400 hover:text-primary transition-colors justify-center">
                <ArrowLeft className="h-4 w-4" />
                Back to sign in
            </Link>
        </>
    )
}

export default function ResetPasswordPage() {
    return (
        <div className="flex min-h-screen items-center justify-center px-6 py-12 bg-slate-50/50">
            <div className="w-full max-w-[420px] space-y-8">
                <div className="flex items-center gap-2.5 mb-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-bold text-lg tracking-tight text-slate-800">AffiliateHub</span>
                </div>

                <Suspense fallback={<div className="text-center text-slate-400 py-8">Loading...</div>}>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </div>
    )
}
