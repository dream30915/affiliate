import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Star, Tag, ArrowUpRight } from "lucide-react"

interface Product {
    id: string
    name: string
    description: string
    price: number
    discount: number
    image: string
    commission: number
    featured: boolean
    category?: { name: string } | null
}

export function ProductCard({ product }: { product: Product }) {
    const discountedPrice = product.price * (1 - product.discount / 100)
    const earning = discountedPrice * product.commission / 100

    return (
        <Link href={`/products/${product.id}`} className="block">
            <div className="group rounded-2xl overflow-hidden flex flex-col h-full bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 hover:-translate-y-1">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-50">
                    <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        {product.featured && (
                            <Badge className="bg-amber-400/90 text-white border-none shadow-sm px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide">
                                <Star className="w-3 h-3 fill-white mr-1" />
                                Featured
                            </Badge>
                        )}
                        {product.discount > 0 && (
                            <Badge className="bg-rose-500/90 text-white border-none shadow-sm px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide">
                                <Tag className="w-3 h-3 mr-1" />
                                {product.discount}% OFF
                            </Badge>
                        )}
                    </div>
                    {product.category && (
                        <div className="absolute bottom-3 left-3">
                            <Badge variant="secondary" className="bg-white/85 backdrop-blur-sm text-slate-700 border-none px-2.5 py-0.5 rounded-md text-[10px] font-medium">
                                {product.category.name}
                            </Badge>
                        </div>
                    )}
                    <div className="absolute top-3 right-3 h-8 w-8 rounded-lg bg-white/85 backdrop-blur-sm text-slate-500 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        <ArrowUpRight className="w-4 h-4" />
                    </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-semibold text-slate-800 line-clamp-1 group-hover:text-primary transition-colors">
                        {product.name}
                    </h3>
                    <p className="text-slate-400 text-sm mt-1 line-clamp-2 leading-relaxed">
                        {product.description}
                    </p>

                    <div className="mt-auto pt-4 flex items-end justify-between border-t border-slate-50">
                        <div>
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-xl font-bold text-slate-900">
                                    ${discountedPrice.toFixed(2)}
                                </span>
                                {product.discount > 0 && (
                                    <span className="text-xs text-slate-400 line-through">
                                        ${product.price.toFixed(2)}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-bold text-emerald-600">${earning.toFixed(2)}</div>
                            <div className="text-[10px] text-slate-400 font-medium">per sale</div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}
