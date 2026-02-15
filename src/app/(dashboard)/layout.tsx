import Link from "next/link"
import {
    LayoutDashboard,
    Package,
    Users,
    LineChart,
    Link as LinkIcon,
    Tag,
    Sparkles,
    Home
} from "lucide-react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { SignOutButton } from "@/components/SignOutButton"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/login")
    }

    const isAdmin = session.user.role === "ADMIN"
    const userEmail = session.user.email || "Unknown"
    const userName = session.user.name || "User"
    const userInitial = (session.user.name?.[0] || session.user.email?.[0] || "?").toUpperCase()

    return (
        <div className="flex min-h-screen bg-slate-50/80">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-100 hidden md:flex flex-col sticky top-0 h-screen">
                {/* Logo */}
                <div className="h-16 flex items-center px-6 border-b border-slate-100">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center shadow-md shadow-primary/20">
                            <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-bold text-lg tracking-tight text-slate-800">
                            Affiliate<span className="text-primary">Hub</span>
                        </span>
                    </Link>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
                    <div>
                        <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                            Overview
                        </div>
                        <nav className="space-y-0.5">
                            <Link href="/dashboard" className="sidebar-link sidebar-link-active">
                                <LayoutDashboard className="w-[18px] h-[18px]" />
                                <span>Dashboard</span>
                            </Link>
                            <Link href="/" className="sidebar-link">
                                <Home className="w-[18px] h-[18px]" />
                                <span>Back to Site</span>
                            </Link>
                        </nav>
                    </div>

                    {isAdmin && (
                        <div>
                            <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                                Admin
                            </div>
                            <nav className="space-y-0.5">
                                <Link href="/admin" className="sidebar-link">
                                    <LayoutDashboard className="w-[18px] h-[18px]" />
                                    <span>Admin Overview</span>
                                </Link>
                                <Link href="/admin/products" className="sidebar-link">
                                    <Package className="w-[18px] h-[18px]" />
                                    <span>Products</span>
                                </Link>
                                <Link href="/admin/categories" className="sidebar-link">
                                    <Tag className="w-[18px] h-[18px]" />
                                    <span>Categories</span>
                                </Link>
                                <Link href="/admin/users" className="sidebar-link">
                                    <Users className="w-[18px] h-[18px]" />
                                    <span>Users</span>
                                </Link>
                            </nav>
                        </div>
                    )}

                    <div>
                        <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                            Affiliate
                        </div>
                        <nav className="space-y-0.5">
                            <Link href="/dashboard/links" className="sidebar-link">
                                <LinkIcon className="w-[18px] h-[18px]" />
                                <span>My Links</span>
                            </Link>
                            <Link href="/dashboard/earnings" className="sidebar-link">
                                <LineChart className="w-[18px] h-[18px]" />
                                <span>Earnings</span>
                            </Link>
                        </nav>
                    </div>
                </div>

                {/* User Section */}
                <div className="p-4 border-t border-slate-100">
                    <div className="flex items-center gap-3 px-2 mb-3">
                        <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center text-white text-sm font-semibold shrink-0">
                            {userInitial}
                        </div>
                        <div className="min-w-0">
                            <div className="text-sm font-medium text-slate-700 truncate">{userName}</div>
                            <div className="text-[11px] text-slate-400 truncate">{userEmail}</div>
                        </div>
                    </div>
                    <SignOutButton />
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 flex flex-col min-w-0">
                <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    )
}
