import { prisma } from "@/lib/prisma"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { notFound } from "next/navigation"
import { PromoteButton } from "@/components/PromoteButton"
import { ReviewForm } from "@/components/ReviewForm"
import { ReviewsList } from "@/components/ReviewsList"
import { Star, Link as LinkIcon, ShieldCheck, Zap, TrendingUp, Info } from "lucide-react"
import Link from "next/link"

export default async function ProductPage({ params }: { params: { id: string } }) {
    const product = await prisma.product.findUnique({
        where: { id: params.id },
        include: {
            category: true,
            reviews: {
                orderBy: { createdAt: "desc" },
            },
        },
    })

    if (!product) {
        notFound()
    }

    const discountedPrice = product.price * (1 - (product.discount || 0) / 100)
    const estEarnings = discountedPrice * (product.commission / 100)
    const avgRating = product.reviews.length > 0
        ? (product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length).toFixed(1)
        : "0.0"

    return (
        <div className="min-h-screen pb-24">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-slate-100">
                <div className="container px-6 mx-auto py-3">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Link href="/products" className="hover:text-slate-600 transition-colors">Products</Link>
                        <span>/</span>
                        <span className="text-slate-600 truncate">{product.name}</span>
                    </div>
                </div>
            </div>

            <div className="container px-6 mx-auto pt-10 md:pt-16">
                <div className="grid lg:grid-cols-12 gap-10 lg:gap-14">

                    {/* Left - Media */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-sm">
                            <Image
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                fill
                                sizes="(max-width: 1024px) 100vw, 58vw"
                                className="object-cover"
                                priority
                            />
                            {product.featured && (
                                <div className="absolute top-4 left-4">
                                    <Badge className="bg-amber-400/90 text-white border-none shadow-sm px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wide">
                                        <Star className="w-3.5 h-3.5 fill-white mr-1" />
                                        Featured
                                    </Badge>
                                </div>
                            )}
                        </div>

                        {/* Details */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-8 space-y-6">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <Info className="w-5 h-5 text-primary" />
                                Product Details
                            </h2>
                            <p className="text-slate-600 leading-relaxed">
                                {product.description}
                            </p>

                            <div className="pt-6 border-t border-slate-100 grid sm:grid-cols-2 gap-5">
                                <div className="flex items-start gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-primary/[0.08] text-primary flex items-center justify-center shrink-0">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-800 text-sm">Verified Seller</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">Quality-checked delivery and tracking.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                        <Zap className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-800 text-sm">Instant Tracking</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">Real-time stats for clicks and sales.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Reviews */}
                        <div className="space-y-6 pt-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-slate-800">Reviews</h2>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg border border-slate-100 text-sm font-semibold text-slate-700">
                                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                    {avgRating}
                                </div>
                            </div>
                            <ReviewsList reviews={product.reviews} />
                            <ReviewForm productId={product.id} />
                        </div>
                    </div>

                    {/* Right - Pricing */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-24 space-y-6">
                            <div className="bg-white rounded-2xl border border-slate-100 p-8 space-y-6 shadow-sm">
                                {product.category && (
                                    <Badge variant="secondary" className="bg-primary/[0.08] text-primary border-none text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-md">
                                        {product.category.name}
                                    </Badge>
                                )}
                                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                                    {product.name}
                                </h1>

                                <div className="flex items-baseline gap-3">
                                    <span className="text-4xl font-bold text-slate-900">${discountedPrice.toFixed(2)}</span>
                                    {product.discount > 0 && (
                                        <>
                                            <span className="text-lg text-slate-400 line-through">${product.price.toFixed(2)}</span>
                                            <Badge className="bg-rose-50 text-rose-600 border-none text-xs font-semibold">-{product.discount}%</Badge>
                                        </>
                                    )}
                                </div>

                                {/* Earnings Card */}
                                <div className="bg-slate-900 rounded-xl p-6 text-white relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 blur-3xl rounded-full" />
                                    <div className="relative z-10 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Your Earnings</span>
                                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                                        </div>
                                        <div className="text-3xl font-bold text-emerald-400">${estEarnings.toFixed(2)}</div>
                                        <p className="text-slate-500 text-xs">Per successful sale</p>
                                        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                                            <span>Commission: {product.commission}%</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <PromoteButton productId={product.id} productName={product.name} />
                                    <p className="text-center text-[10px] text-slate-400 font-medium">
                                        Requires an active affiliate account.
                                    </p>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2 text-sm">
                                    <LinkIcon className="w-4 h-4 text-primary" />
                                    Network Stats
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-3 bg-slate-50 rounded-xl">
                                        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Avg. CVR</div>
                                        <div className="text-lg font-bold text-slate-800 mt-1">4.2%</div>
                                    </div>
                                    <div className="text-center p-3 bg-slate-50 rounded-xl">
                                        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Payout</div>
                                        <div className="text-lg font-bold text-slate-800 mt-1">Net-30</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
