import Link from "next/link"
import { Sparkles } from "lucide-react"

export function Footer() {
    return (
        <footer className="border-t border-slate-100 bg-white/60 backdrop-blur-sm">
            <div className="container px-6 py-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center">
                            <Sparkles className="h-3.5 w-3.5 text-white" />
                        </div>
                        <span className="font-bold text-sm tracking-tight text-slate-600">
                            Affiliate<span className="text-primary">Hub</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-slate-400">
                        <Link href="/products" className="hover:text-slate-600 transition-colors">
                            Products
                        </Link>
                        <Link href="/login" className="hover:text-slate-600 transition-colors">
                            Sign In
                        </Link>
                        <Link href="/register" className="hover:text-slate-600 transition-colors">
                            Get Started
                        </Link>
                    </div>
                    <p className="text-xs text-slate-400">
                        &copy; {new Date().getFullYear()} AffiliateHub. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}
