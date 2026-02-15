import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/ProductCard"
import { ArrowRight, Sparkles, TrendingUp, Zap, Star, Shield, BarChart3 } from "lucide-react"

export default async function Home() {
    const categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
        take: 6
    })

    const featuredProducts = await prisma.product.findMany({
        where: { featured: true },
        include: { category: true },
        take: 4,
        orderBy: { createdAt: "desc" },
    })

    const latestProducts = await prisma.product.findMany({
        include: { category: true },
        take: 8,
        orderBy: { createdAt: "desc" },
    })

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero */}
            <section className="relative py-24 md:py-36 overflow-hidden bg-slate-50/50">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] rounded-full bg-primary/[0.07] blur-[100px]" />
                    <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[50%] rounded-full bg-violet-400/[0.07] blur-[100px]" />
                </div>

                <div className="container px-6 mx-auto relative z-10">
                    <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-8">
                        <div className="section-label bg-primary/[0.08] text-primary border border-primary/10">
                            <Sparkles className="w-3.5 h-3.5" />
                            Affiliate Platform
                        </div>

                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-slate-900 leading-[1.1]">
                            Earn commissions on products{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-500">you believe in</span>
                        </h1>

                        <p className="max-w-xl text-slate-500 md:text-lg leading-relaxed">
                            High commissions, real-time tracking, and a curated catalog. Start promoting in minutes.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-3">
                            <Link href="/register">
                                <Button size="lg" className="h-12 px-8 rounded-xl bg-primary hover:bg-primary/90 font-semibold shadow-lg shadow-primary/20 text-base">
                                    Get Started Free
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="/products">
                                <Button variant="outline" size="lg" className="h-12 px-8 rounded-xl border-slate-200 font-semibold text-base hover:bg-white">
                                    Browse Products
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Bar */}
            <section className="py-10 bg-white border-y border-slate-100">
                <div className="container px-6 mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
                        <div className="flex items-center gap-3 justify-center">
                            <div className="h-10 w-10 rounded-xl bg-primary/[0.08] text-primary flex items-center justify-center">
                                <BarChart3 className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="font-semibold text-slate-800 text-sm">Real-time Stats</div>
                                <div className="text-xs text-slate-400">Track every click & sale</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 justify-center">
                            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <Shield className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="font-semibold text-slate-800 text-sm">Verified Products</div>
                                <div className="text-xs text-slate-400">Quality-checked catalog</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 justify-center">
                            <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                <Zap className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="font-semibold text-slate-800 text-sm">Instant Payouts</div>
                                <div className="text-xs text-slate-400">Net-30 payment terms</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Category Navigation */}
            {categories.length > 0 && (
                <section className="py-16 bg-slate-50/30">
                    <div className="container px-6 mx-auto">
                        <div className="text-center mb-10">
                            <h2 className="text-2xl font-bold text-slate-900">Browse by Category</h2>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            {categories.map((cat) => (
                                <Link
                                    key={cat.id}
                                    href={`/products?category=${cat.slug}`}
                                    className="px-5 py-2.5 rounded-xl bg-white border border-slate-100 shadow-sm text-sm font-medium text-slate-600 hover:border-primary/30 hover:text-primary hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    {cat.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Featured */}
            {featuredProducts.length > 0 && (
                <section className="py-20 bg-white">
                    <div className="container px-6 mx-auto">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
                            <div className="space-y-2">
                                <div className="section-label bg-amber-50 text-amber-600">
                                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                                    Top Picks
                                </div>
                                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Featured Products</h2>
                                <p className="text-slate-500 max-w-md">Hand-picked high-conversion products with premium commission rates.</p>
                            </div>
                            <Link href="/products?featured=true">
                                <Button variant="outline" className="h-10 px-5 rounded-xl border-slate-200 font-medium hover:bg-slate-50">
                                    View All
                                    <TrendingUp className="ml-2 w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Latest */}
            <section className="py-20 bg-slate-50/50">
                <div className="container px-6 mx-auto">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
                        <div className="space-y-2">
                            <div className="section-label bg-primary/[0.08] text-primary">
                                <Sparkles className="w-3.5 h-3.5" />
                                New Arrivals
                            </div>
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Latest Products</h2>
                        </div>
                        <Link href="/products">
                            <Button className="h-10 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 font-medium shadow-sm">
                                Browse All
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {latestProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
