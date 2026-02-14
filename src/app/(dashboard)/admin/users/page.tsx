import { prisma } from "@/lib/prisma"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, MousePointerClick, DollarSign } from "lucide-react"

export default async function AdminUsersPage() {
    // ── Fetch users with deep stats ──
    const users = await prisma.user.findMany({
        include: {
            _count: {
                select: { affiliateLinks: true, orders: true },
            },
            affiliateLinks: {
                include: {
                    _count: { select: { clicks: true } },
                    orders: {
                        where: { status: "COMPLETED" },
                        select: { commission: true },
                    },
                },
            },
        },
        orderBy: { createdAt: "desc" },
    })

    // ── Per-user computed stats ──
    const usersWithStats = users.map((user) => {
        const totalClicks = user.affiliateLinks.reduce(
            (sum, link) => sum + link._count.clicks, 0
        )
        const totalCommissionEarned = user.affiliateLinks.reduce(
            (sum, link) => sum + link.orders.reduce((s, o) => s + o.commission, 0), 0
        )
        return { ...user, totalClicks, totalCommissionEarned }
    })

    // ── Platform-wide summary ──
    const totalUsers = users.length
    const totalAffiliates = users.filter(
        (u) => u._count.affiliateLinks > 0
    ).length
    const platformClicks = usersWithStats.reduce((s, u) => s + u.totalClicks, 0)
    const platformCommission = usersWithStats.reduce(
        (s, u) => s + u.totalCommissionEarned, 0
    )

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Users</h2>
                <p className="text-muted-foreground">
                    Manage platform users and their roles.
                </p>
            </div>

            {/* ── Summary Cards ── */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalUsers}</div>
                        <p className="text-xs text-muted-foreground">Registered accounts</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Active Affiliates
                        </CardTitle>
                        <UserCheck className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-500">
                            {totalAffiliates}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Users with at least 1 link
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Platform Clicks
                        </CardTitle>
                        <MousePointerClick className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-500">
                            {platformClicks.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Total affiliate clicks
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Commission Paid
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-600">
                            ${platformCommission.toFixed(2)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            To all affiliates
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* ── Users Table ── */}
            <Card>
                <CardHeader>
                    <CardTitle>All Users ({users.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Links</TableHead>
                                <TableHead>Clicks</TableHead>
                                <TableHead>Orders</TableHead>
                                <TableHead>Commission Earned</TableHead>
                                <TableHead>Joined</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {usersWithStats.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">
                                        {user.name || "—"}
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                user.role === "ADMIN"
                                                    ? "default"
                                                    : "secondary"
                                            }
                                        >
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{user._count.affiliateLinks}</TableCell>
                                    <TableCell>{user.totalClicks}</TableCell>
                                    <TableCell>{user._count.orders}</TableCell>
                                    <TableCell
                                        className={
                                            user.totalCommissionEarned > 0
                                                ? "font-bold text-emerald-600"
                                                : "text-muted-foreground"
                                        }
                                    >
                                        ${user.totalCommissionEarned.toFixed(2)}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {user.createdAt.toLocaleDateString("en", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
