import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import {
    DollarSign,
    Users,
    MousePointerClick,
    ShoppingCart,
    TrendingUp,
    Zap,
    Activity,
    Package
} from "lucide-react"

export default async function AdminDashboard() {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
        redirect("/dashboard")
    }

    // Fetch real stats
    const productCount = await prisma.product.count()
    const userCount = await prisma.user.count()
    const totalClicks = await prisma.click.count()
    const orders = await prisma.order.findMany({
        where: { status: "COMPLETED" },
        select: { total: true },
    })
    const totalEarnings = orders.reduce((sum, o) => sum + o.total, 0)

    const stats = [
        {
            title: "Total Revenue",
            value: `$${totalEarnings.toLocaleString()}`,
            description: "From completed orders",
            icon: DollarSign,
            color: "text-emerald-500",
            bg: "bg-emerald-50",
            trend: "+12.5%",
            trendUp: true
        },
        {
            title: "Active Users",
            value: userCount.toString(),
            description: "Registered platform users",
            icon: Users,
            color: "text-blue-500",
            bg: "bg-blue-50",
            trend: "+3.2%",
            trendUp: true
        },
        {
            title: "Total Products",
            value: productCount.toString(),
            description: "Items in active catalog",
            icon: Package,
            color: "text-amber-500",
            bg: "bg-amber-50",
            trend: "+5 new",
            trendUp: true
        },
        {
            title: "Total Clicks",
            value: totalClicks.toLocaleString(),
            description: "Affiliate traffic tracked",
            icon: MousePointerClick,
            color: "text-primary",
            bg: "bg-primary/5",
            trend: "+18%",
            trendUp: true
        }
    ]

    return (
        <div className="space-y-10">
            <div>
                <h2 className="text-3xl font-black tracking-tight text-slate-800">Admin Overview</h2>
                <p className="text-slate-500 mt-1 font-medium">Control center for your affiliate network.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => (
                    <div key={i} className="glass p-8 rounded-[2rem] shadow-sm ring-1 ring-slate-100 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                        <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500`}></div>

                        <div className="flex flex-col gap-6 relative z-10">
                            <div className="flex items-center justify-between">
                                <div className={`h-12 w-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                                <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
                                    <TrendingUp className="w-3 h-3" />
                                    {stat.trend}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="text-3xl font-black text-slate-800">{stat.value}</div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.title}</p>
                                    <p className="text-xs text-slate-400 font-medium">{stat.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 glass p-8 rounded-[2rem] shadow-sm ring-1 ring-slate-100">
                    <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
                        <Activity className="w-6 h-6 text-primary" />
                        Network Activity
                    </h3>
                    <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-slate-100 rounded-[2rem]">
                        <p className="text-slate-300 font-bold uppercase tracking-widest text-sm">Activity Chart Placeholder</p>
                    </div>
                </div>

                <div className="glass p-8 rounded-[2rem] shadow-sm ring-1 ring-slate-100">
                    <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
                        <Zap className="w-6 h-6 text-amber-500" />
                        Quick Actions
                    </h3>
                    <div className="space-y-3">
                        <button className="w-full p-4 bg-slate-50 hover:bg-primary hover:text-white rounded-2xl border border-slate-100 flex items-center gap-4 transition-all group">
                            <div className="h-10 w-10 rounded-xl bg-white text-primary flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                <ShoppingCart className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-sm">Add New Product</span>
                        </button>
                        <button className="w-full p-4 bg-slate-50 hover:bg-primary hover:text-white rounded-2xl border border-slate-100 flex items-center gap-4 transition-all group">
                            <div className="h-10 w-10 rounded-xl bg-white text-blue-500 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                <Users className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-sm">Review User Requests</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
