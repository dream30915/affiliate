import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, LayoutDashboard, ArrowRight } from "lucide-react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function Navbar() {
    const session = await getServerSession(authOptions)

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100/80">
            <div className="container flex h-16 items-center justify-between px-6">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center shadow-md shadow-primary/25 group-hover:shadow-lg group-hover:shadow-primary/30 transition-shadow">
                            <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-bold text-lg tracking-tight text-slate-800">
                            Affiliate<span className="text-primary">Hub</span>
                        </span>
                    </Link>
                    <div className="hidden md:flex items-center gap-1">
                        <Link href="/" className="px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors">
                            Home
                        </Link>
                        <Link href="/products" className="px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors">
                            Products
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {session ? (
                        <Link href="/dashboard">
                            <Button size="sm" className="h-9 px-4 rounded-lg bg-primary hover:bg-primary/90 shadow-md shadow-primary/20 font-medium">
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                Dashboard
                            </Button>
                        </Link>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="ghost" size="sm" className="h-9 px-4 rounded-lg text-slate-600 font-medium">
                                    Sign In
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button size="sm" className="h-9 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white shadow-md font-medium">
                                    Get Started
                                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}
