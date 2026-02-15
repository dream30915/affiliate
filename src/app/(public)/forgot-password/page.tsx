"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, Mail, Sparkles } from "lucide-react"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const res = await fetch("/api/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })

            if (res.ok) {
                setSent(true)
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
        <div className="flex min-h-screen items-center justify-center px-6 py-12 bg-slate-50/50">
            <div className="w-full max-w-[420px] space-y-8">
                <div className="flex items-center gap-2.5 mb-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-bold text-lg tracking-tight text-slate-800">AffiliateHub</span>
                </div>

                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        {sent ? "Check your email" : "Reset your password"}
                    </h1>
                    <p className="text-slate-500 mt-1.5 text-sm">
                        {sent
                            ? "If an account exists with that email, we've sent a password reset link."
                            : "Enter your email address and we'll send you a reset link."
                        }
                    </p>
                </div>

                {!sent ? (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-11 rounded-xl bg-white border-slate-200 focus:border-primary focus:ring-primary/20"
                            />
                        </div>

                        {error && (
                            <div className="text-sm text-red-500 bg-red-50 border border-red-100 px-4 py-2.5 rounded-xl">
                                {error}
                            </div>
                        )}

                        <Button className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 font-semibold shadow-lg shadow-primary/20" type="submit" disabled={loading}>
                            <Mail className="mr-2 h-4 w-4" />
                            {loading ? "Sending..." : "Send Reset Link"}
                        </Button>
                    </form>
                ) : (
                    <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center space-y-4">
                        <div className="h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                            <Mail className="h-7 w-7" />
                        </div>
                        <p className="text-sm text-slate-500">
                            The link will expire in 1 hour.
                        </p>
                    </div>
                )}

                <Link href="/login" className="flex items-center gap-2 text-sm text-slate-400 hover:text-primary transition-colors justify-center">
                    <ArrowLeft className="h-4 w-4" />
                    Back to sign in
                </Link>
            </div>
        </div>
    )
}
