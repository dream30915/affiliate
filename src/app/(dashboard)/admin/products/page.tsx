import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { Plus, Pencil, Trash, Star, Tag } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default async function AdminProductsPage() {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
        redirect("/dashboard")
    }

    const products = await prisma.product.findMany({
        include: { category: true },
        orderBy: { createdAt: "desc" },
    })

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-800">Products</h2>
                    <p className="text-slate-500 text-sm mt-1">Manage your catalog and commissions.</p>
                </div>
                <Link href="/admin/products/new">
                    <Button className="h-10 px-5 rounded-xl bg-primary hover:bg-primary/90 font-medium shadow-md shadow-primary/20">
                        <Plus className="mr-2 h-4 w-4" /> Add Product
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50/80 border-slate-100 hover:bg-slate-50/80">
                            <TableHead className="w-12 pl-6 text-xs">#</TableHead>
                            <TableHead className="text-xs">Product</TableHead>
                            <TableHead className="text-xs">Category</TableHead>
                            <TableHead className="text-xs">Price</TableHead>
                            <TableHead className="text-xs">Commission</TableHead>
                            <TableHead className="text-xs">Status</TableHead>
                            <TableHead className="text-right pr-6 text-xs">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-32 text-center text-slate-400 text-sm">
                                    No products yet. Add your first product to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            products.map((product, index) => (
                                <TableRow key={product.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors group">
                                    <TableCell className="pl-6 text-sm text-slate-400 font-medium">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-lg overflow-hidden border border-slate-100 relative shrink-0">
                                                <Image
                                                    src={product.image || "/placeholder.svg"}
                                                    alt={product.name}
                                                    fill
                                                    sizes="40px"
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-medium text-slate-800 text-sm truncate">{product.name}</div>
                                                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                                                    {product.id.substring(0, 8)}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="px-2 py-0.5 rounded-md bg-primary/[0.08] text-primary text-[11px] font-medium">
                                            {product.category?.name || "Uncategorized"}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium text-slate-700 text-sm">${product.price.toFixed(2)}</div>
                                            {product.discount > 0 && (
                                                <div className="flex items-center gap-1 text-[10px] text-rose-500 mt-0.5">
                                                    <Tag className="w-3 h-3" />
                                                    {product.discount}% OFF
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            <span className="font-medium text-slate-700 text-sm">{product.commission}%</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {product.featured ? (
                                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                                                <Star className="w-3 h-3 fill-amber-500" />
                                                Featured
                                            </span>
                                        ) : (
                                            <span className="text-[11px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md">Standard</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-slate-100" disabled>
                                                <Pencil className="h-3.5 w-3.5" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-red-50 hover:text-red-500" disabled>
                                                <Trash className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
