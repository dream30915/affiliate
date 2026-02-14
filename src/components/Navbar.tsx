import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingBag, LayoutDashboard } from "lucide-react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function Navbar() {
    const session = await getServerSession(authOptions)

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                        <ShoppingBag className="h-6 w-6 text-primary" />
                        <span>AffiliateStore</span>
                    </Link>
                    <div className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
                        <Link href="/" className="hover:text-primary transition-colors">
                            Home
                        </Link>
                        <Link href="/products" className="hover:text-primary transition-colors">
                            Products
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {session ? (
                        <Link href="/dashboard">
                            <Button size="sm">
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                Dashboard
                            </Button>
                        </Link>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="ghost" size="sm">
                                    Sign In
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button size="sm">
                                    Get Started
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}
