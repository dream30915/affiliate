"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sparkles, ArrowRight } from "lucide-react"

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            })

            if (result?.error) {
                setError("Invalid email or password")
                return
            }

            router.push("/dashboard")
            router.refresh()
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
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-violet-600/20 to-slate-900" />
                <div className="absolute top-[20%] left-[10%] w-[60%] h-[40%] rounded-full bg-primary/20 blur-[100px]" />
                <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] rounded-full bg-violet-500/15 blur-[80px]" />
                <div className="relative z-10 px-16 max-w-lg">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                            <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-white font-bold text-xl tracking-tight">AffiliateHub</span>
                    </div>
                    <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
                        Start earning with every click.
                    </h2>
                    <p className="text-slate-400 text-lg leading-relaxed">
                        Join thousands of affiliates earning premium commissions on high-converting products.
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
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back</h1>
                        <p className="text-slate-500 mt-1.5 text-sm">Enter your credentials to access your account</p>
                    </div>

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
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-sm font-medium text-slate-700">Password</Label>
                                <Link href="/forgot-password" className="text-xs text-slate-400 hover:text-primary transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
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
                            {loading ? "Signing in..." : "Sign In"}
                            {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-slate-500">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="text-primary font-medium hover:underline">
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
