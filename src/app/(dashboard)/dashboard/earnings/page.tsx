import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, MousePointerClick, ShoppingBag } from "lucide-react"

export default async function EarningsPage() {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    // ── Affiliate links with click counts ──
    const links = await prisma.affiliateLink.findMany({
        where: { userId },
        include: {
            product: true,
            _count: { select: { clicks: true } },
        },
        orderBy: { createdAt: "desc" },
    })

    // ── Orders attributed to this affiliate (real earnings) ──
    const affiliatedOrders = await prisma.order.findMany({
        where: {
            affiliateLink: { userId },
        },
        include: {
            items: { include: { product: true } },
            affiliateLink: true,
        },
        orderBy: { createdAt: "desc" },
    })

    // ── Aggregate stats ──
    const completedOrders = affiliatedOrders.filter(o => o.status === "COMPLETED")
    const pendingOrders = affiliatedOrders.filter(o => o.status === "PENDING")

    const totalEarned = completedOrders.reduce((sum, o) => sum + o.commission, 0)
    const pendingEarnings = pendingOrders.reduce((sum, o) => sum + o.commission, 0)
    const totalClicks = links.reduce((sum, link) => sum + link._count.clicks, 0)
    const totalConversions = affiliatedOrders.length

    // ── Per-link earnings aggregation ──
    const earningsByLinkId = new Map<string, { earned: number; orders: number }>()
    for (const order of completedOrders) {
        if (order.affiliateLinkId) {
            const existing = earningsByLinkId.get(order.affiliateLinkId) || { earned: 0, orders: 0 }
            existing.earned += order.commission
            existing.orders += 1
            earningsByLinkId.set(order.affiliateLinkId, existing)
        }
    }

    // ── This month stats ──
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const thisMonthOrders = completedOrders.filter(o => o.createdAt >= startOfMonth)
    const thisMonthEarned = thisMonthOrders.reduce((sum, o) => sum + o.commission, 0)

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Earnings</h2>
                <p className="text-muted-foreground">Track your commissions and earnings from affiliate links.</p>
            </div>

            {/* ── Summary Cards ── */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
                        <DollarSign className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-600">${totalEarned.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">From {completedOrders.length} completed order{completedOrders.length !== 1 ? "s" : ""}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <TrendingUp className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-500">${pendingEarnings.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">{pendingOrders.length} pending order{pendingOrders.length !== 1 ? "s" : ""}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">This Month</CardTitle>
                        <DollarSign className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-500">${thisMonthEarned.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">{thisMonthOrders.length} order{thisMonthOrders.length !== 1 ? "s" : ""} this month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Conversions</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-500">{totalConversions}</div>
                        <p className="text-xs text-muted-foreground">
                            {totalClicks > 0
                                ? `${((totalConversions / totalClicks) * 100).toFixed(1)}% conversion rate`
                                : "No clicks yet"}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* ── Earnings by Product ── */}
            <Card>
                <CardHeader>
                    <CardTitle>Earnings by Product</CardTitle>
                </CardHeader>
                <CardContent>
                    {links.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            No affiliate links yet. Create links to start earning!
                        </p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Commission Rate</TableHead>
                                    <TableHead>Earning / Sale</TableHead>
                                    <TableHead>Clicks</TableHead>
                                    <TableHead>Orders</TableHead>
                                    <TableHead>Earned</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {links.map((link) => {
                                    const earningPerSale = link.product.price * (link.product.commission / 100)
                                    const linkStats = earningsByLinkId.get(link.id) || { earned: 0, orders: 0 }
                                    return (
                                        <TableRow key={link.id}>
                                            <TableCell className="font-medium">{link.product.name}</TableCell>
                                            <TableCell>${link.product.price.toFixed(2)}</TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">{link.product.commission}%</Badge>
                                            </TableCell>
                                            <TableCell className="text-emerald-600 font-medium">
                                                ${earningPerSale.toFixed(2)}
                                            </TableCell>
                                            <TableCell>{link._count.clicks}</TableCell>
                                            <TableCell>{linkStats.orders}</TableCell>
                                            <TableCell className="font-bold text-emerald-600">
                                                ${linkStats.earned.toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* ── Recent Affiliate Orders ── */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Orders (via your links)</CardTitle>
                </CardHeader>
                <CardContent>
                    {affiliatedOrders.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            No orders yet. When someone purchases through your affiliate link, it will appear here.
                        </p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Products</TableHead>
                                    <TableHead>Order Total</TableHead>
                                    <TableHead>Your Commission</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {affiliatedOrders.slice(0, 20).map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-mono text-xs">
                                            {order.id.slice(0, 12)}...
                                        </TableCell>
                                        <TableCell>
                                            {order.items.map(i => i.product.name).join(", ")}
                                        </TableCell>
                                        <TableCell>${order.total.toFixed(2)}</TableCell>
                                        <TableCell className="font-bold text-emerald-600">
                                            ${order.commission.toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                order.status === "COMPLETED" ? "default" :
                                                order.status === "PENDING" ? "secondary" :
                                                "destructive"
                                            }>
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {order.createdAt.toLocaleDateString("en", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
