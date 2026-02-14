import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    LayoutDashboard,
    Package,
    Users,
    LineChart,
    Link as LinkIcon
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
    const userInitial = (session.user.name?.[0] || session.user.email?.[0] || "?").toUpperCase()

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 border-r bg-muted/40 hidden md:flex flex-col">
                <div className="h-16 flex items-center px-6 border-b font-semibold text-lg">
                    AffiliateAdmin
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/dashboard">
                        <Button variant="ghost" className="w-full justify-start">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Overview
                        </Button>
                    </Link>

                    {isAdmin && (
                        <>
                            <div className="pt-4 pb-2 px-4 text-xs font-semibold text-muted-foreground">
                                ADMIN
                            </div>
                            <Link href="/admin">
                                <Button variant="ghost" className="w-full justify-start">
                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                    Admin Dashboard
                                </Button>
                            </Link>
                            <Link href="/admin/products">
                                <Button variant="ghost" className="w-full justify-start">
                                    <Package className="mr-2 h-4 w-4" />
                                    Products
                                </Button>
                            </Link>
                            <Link href="/admin/users">
                                <Button variant="ghost" className="w-full justify-start">
                                    <Users className="mr-2 h-4 w-4" />
                                    Users
                                </Button>
                            </Link>
                        </>
                    )}

                    <div className="pt-4 pb-2 px-4 text-xs font-semibold text-muted-foreground">
                        AFFILIATE
                    </div>
                    <Link href="/dashboard/links">
                        <Button variant="ghost" className="w-full justify-start">
                            <LinkIcon className="mr-2 h-4 w-4" />
                            My Links
                        </Button>
                    </Link>
                    <Link href="/dashboard/earnings">
                        <Button variant="ghost" className="w-full justify-start">
                            <LineChart className="mr-2 h-4 w-4" />
                            Earnings
                        </Button>
                    </Link>
                </nav>
                <div className="p-4 border-t">
                    <SignOutButton />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                <header className="h-16 border-b flex items-center justify-end px-6">
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">{userEmail}</span>
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {userInitial}
                        </div>
                    </div>
                </header>
                <div className="p-6 md:p-8 flex-1 overflow-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
