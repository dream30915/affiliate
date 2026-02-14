import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, MousePointerClick, ShoppingBag, TrendingUp } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export default async function AffiliateDashboard() {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

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
    const conversionRate = totalClicks > 0 ? ((totalLinks / totalClicks) * 100).toFixed(1) : "0.0"

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
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Affiliate Overview</h2>
                <p className="text-muted-foreground">Welcome back! Here&apos;s how you&apos;re performing.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Earnings
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-600">$0.00</div>
                        <p className="text-xs text-muted-foreground">
                            Earnings tracked after orders
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Active Links
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-500">{totalLinks}</div>
                        <p className="text-xs text-muted-foreground">
                            Affiliate links generated
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Clicks
                        </CardTitle>
                        <MousePointerClick className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-500">{totalClicks}</div>
                        <p className="text-xs text-muted-foreground">
                            Across all your links
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Conversions
                        </CardTitle>
                        <ShoppingBag className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-500">0</div>
                        <p className="text-xs text-muted-foreground">
                            {conversionRate}% conversion rate
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Clicks (Last 7 Days)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px] flex items-end gap-2">
                            {Object.entries(clicksByDay).map(([day, count]) => (
                                <div key={day} className="flex-1 flex flex-col items-center gap-1">
                                    <span className="text-xs font-medium text-muted-foreground">{count}</span>
                                    <div
                                        className="w-full bg-blue-500 rounded-t-sm min-h-[4px]"
                                        style={{ height: `${(count / maxDayClicks) * 160}px` }}
                                    />
                                    <span className="text-[10px] text-muted-foreground">
                                        {new Date(day).toLocaleDateString("en", { weekday: "short" })}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Clicks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {recentClicks.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No clicks yet. Share your affiliate links to get started!</p>
                            ) : (
                                recentClicks.map((click) => (
                                    <div key={click.id} className="flex items-center">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {click.affiliateLink.product.name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {click.createdAt.toLocaleDateString("en", {
                                                    month: "short",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                        </div>
                                        <div className="ml-auto text-sm font-medium text-emerald-600">
                                            +${(click.affiliateLink.product.price * (click.affiliateLink.product.commission / 100)).toFixed(2)} potential
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
