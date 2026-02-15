"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sparkles, ArrowRight } from "lucide-react"

export default function RegisterPage() {
    const router = useRouter()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            })

            if (res.ok) {
                router.push("/login")
            } else {
                const data = await res.json()
                setError(data.message || "Registration failed")
            }
        } catch {
            setError("An unexpected error occurred")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600/30 via-primary/20 to-slate-900" />
                <div className="absolute top-[30%] right-[10%] w-[50%] h-[40%] rounded-full bg-violet-500/20 blur-[100px]" />
                <div className="absolute bottom-[20%] left-[10%] w-[40%] h-[30%] rounded-full bg-primary/15 blur-[80px]" />
                <div className="relative z-10 px-16 max-w-lg">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                            <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-white font-bold text-xl tracking-tight">AffiliateHub</span>
                    </div>
                    <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
                        Turn your audience into income.
                    </h2>
                    <p className="text-slate-400 text-lg leading-relaxed">
                        Create your free account, pick products you love, and start earning commissions immediately.
                    </p>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 bg-slate-50/50">
                <div className="w-full max-w-[420px] space-y-8">
                    <div className="lg:hidden flex items-center gap-2.5 mb-4">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center">
                            <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-bold text-lg tracking-tight text-slate-800">AffiliateHub</span>
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create your account</h1>
                        <p className="text-slate-500 mt-1.5 text-sm">Get started in under a minute</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium text-slate-700">Full Name</Label>
                            <Input
                                id="name"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="h-11 rounded-xl bg-white border-slate-200 focus:border-primary focus:ring-primary/20"
                            />
                        </div>
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
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium text-slate-700">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Min 8 chars, A-Z, a-z, 0-9"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                            {loading ? "Creating account..." : "Create Account"}
                            {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-slate-500">
                        Already have an account?{" "}
                        <Link href="/login" className="text-primary font-medium hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
