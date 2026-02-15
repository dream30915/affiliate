import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, MousePointerClick, ShoppingBag, TrendingUp } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

export default async function AffiliateDashboard() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        redirect("/login")
    }
    const userId = session.user.id

    // Get affiliate links for this user
    const affiliateLinks = await prisma.affiliateLink.findMany({
        where: { userId },
        include: {
            product: true,
            _count: { select: { clicks: true } },
        },
    })

    // Calculate real stats
    const totalClicks = affiliateLinks.reduce((sum, link) => sum + link.visits, 0)
    const totalLinks = affiliateLinks.length

    // Calculate real earnings from orders
    const orders = await prisma.order.findMany({
        where: {
            affiliateLink: { userId },
            status: "COMPLETED"
        }
    })
    const totalEarnings = orders.reduce((sum, order) => sum + order.commission, 0)
    const conversionRate = totalClicks > 0 ? ((orders.length / totalClicks) * 100).toFixed(1) : "0.0"

    // Get recent clicks across all affiliate links
    const recentClicks = await prisma.click.findMany({
        where: {
            affiliateLink: { userId },
        },
        include: {
            affiliateLink: {
                include: { product: true },
            },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
    })

    // Get clicks for last 7 days for chart
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const weekClicks = await prisma.click.findMany({
        where: {
            affiliateLink: { userId },
            createdAt: { gte: sevenDaysAgo },
        },
        select: { createdAt: true },
    })

    // Group by day
    const clicksByDay: Record<string, number> = {}
    for (let i = 6; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        clicksByDay[d.toISOString().split("T")[0]] = 0
    }
    for (const click of weekClicks) {
        const day = click.createdAt.toISOString().split("T")[0]
        if (clicksByDay[day] !== undefined) {
            clicksByDay[day]++
        }
    }
    const maxDayClicks = Math.max(...Object.values(clicksByDay), 1)

    return (
        <div className="space-y-10">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-800">Affiliate Overview</h2>
                <p className="text-slate-500 mt-1">Welcome back! Here&apos;s how your performance looks today.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="premium-card p-6 rounded-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <DollarSign className="h-16 w-16 text-emerald-600" />
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-600">
                            <DollarSign className="h-6 w-6" />
                        </div>
                        <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Earnings</span>
                    </div>
                    <div className="text-4xl font-bold text-slate-800">${totalEarnings.toFixed(2)}</div>
                    <div className="mt-4 flex items-center text-xs font-medium text-emerald-600">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        <span>Real-time tracking</span>
                    </div>
                </div>

                <div className="premium-card p-6 rounded-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrendingUp className="h-16 w-16 text-orange-500" />
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-2xl bg-orange-100 text-orange-500">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Active Links</span>
                    </div>
                    <div className="text-4xl font-bold text-slate-800">{totalLinks}</div>
                    <div className="mt-4 text-xs text-slate-400">Generated affiliate links</div>
                </div>

                <div className="premium-card p-6 rounded-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <MousePointerClick className="h-16 w-16 text-blue-500" />
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-2xl bg-blue-100 text-blue-500">
                            <MousePointerClick className="h-6 w-6" />
                        </div>
                        <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Clicks</span>
                    </div>
                    <div className="text-4xl font-bold text-slate-800">{totalClicks}</div>
                    <div className="mt-4 text-xs text-slate-400">Visitor engagement</div>
                </div>

                <div className="premium-card p-6 rounded-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <ShoppingBag className="h-16 w-16 text-purple-500" />
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-2xl bg-purple-100 text-purple-500">
                            <ShoppingBag className="h-6 w-6" />
                        </div>
                        <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Conversions</span>
                    </div>
                    <div className="text-4xl font-bold text-slate-800">{orders.length}</div>
                    <div className="mt-4 flex items-center text-xs font-medium text-purple-600">
                        <span>{conversionRate}% conversion rate</span>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <div className="glass col-span-4 p-8 rounded-[2rem] shadow-sm ring-1 ring-slate-200">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-slate-800">Traffic Analysis</h3>
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                            Last 7 Days
                        </div>
                    </div>
                    <div className="h-[280px] flex items-end gap-3 pt-4">
                        {Object.entries(clicksByDay).map(([day, count]) => (
                            <div key={day} className="flex-1 flex flex-col items-center group">
                                <div className="mb-2 relative flex flex-col items-center">
                                    <span className="text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-all -translate-y-2 group-hover:translate-y-0">
                                        {count}
                                    </span>
                                    <div
                                        className="w-full max-w-[40px] bg-gradient-to-t from-primary/80 to-primary rounded-2xl min-h-[8px] group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-500"
                                        style={{ height: `${(count / maxDayClicks) * 200}px` }}
                                    />
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase mt-4 group-hover:text-primary transition-colors">
                                    {new Date(day).toLocaleDateString("en", { weekday: "short" })}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass col-span-3 p-8 rounded-[2rem] shadow-sm ring-1 ring-slate-200">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-slate-800">Recent Activity</h3>
                    </div>
                    <div className="space-y-6">
                        {recentClicks.length === 0 ? (
                            <div className="py-12 text-center">
                                <div className="inline-flex items-center justify-center p-4 rounded-full bg-slate-50 text-slate-300 mb-4">
                                    <MousePointerClick className="w-10 h-10" />
                                </div>
                                <p className="text-sm text-slate-400">No clicks yet. Share your links to start seeing data!</p>
                            </div>
                        ) : (
                            recentClicks.map((click) => (
                                <div key={click.id} className="flex items-center p-3 rounded-2xl hover:bg-slate-50 transition-colors group">
                                    <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center mr-4 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                        <MousePointerClick className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-slate-800">
                                            {click.affiliateLink?.product?.name ?? "Unknown Product"}
                                        </p>
                                        <p className="text-[11px] font-medium text-slate-400">
                                            {click.createdAt.toLocaleDateString("en", {
                                                month: "short",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                    <div className="ml-auto text-right">
                                        <div className="text-xs font-bold text-emerald-600">
                                            +${((click.affiliateLink?.product?.price ?? 0) * ((click.affiliateLink?.product?.commission ?? 0) / 100)).toFixed(2)}
                                        </div>
                                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Potential</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
