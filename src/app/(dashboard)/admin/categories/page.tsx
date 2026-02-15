import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus, Tag, Trash, Pencil } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default async function AdminCategoriesPage() {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
        redirect("/dashboard")
    }

    const categories = await prisma.category.findMany({
        include: { _count: { select: { products: true } } },
        orderBy: { name: "asc" },
    })

    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-800">Category Management</h2>
                    <p className="text-slate-500 mt-1">Organize your products into logical groups.</p>
                </div>
                <Button className="rounded-2xl h-12 px-6 shadow-lg shadow-primary/20 hover:scale-105 transition-transform" disabled>
                    <Plus className="mr-2 h-5 w-5" /> Add New Category
                </Button>
            </div>

            <div className="glass rounded-[2rem] overflow-hidden border-none shadow-sm ring-1 ring-slate-200">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="border-slate-100 hover:bg-transparent">
                            <TableHead className="w-16 pl-8">No.</TableHead>
                            <TableHead>Category Name</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Products Count</TableHead>
                            <TableHead className="text-right pr-8">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-40 text-center text-slate-400">
                                    No categories found. Create your first category to get started!
                                </TableCell>
                            </TableRow>
                        ) : (
                            categories.map((category, index) => (
                                <TableRow key={category.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors group">
                                    <TableCell className="pl-8 font-medium text-slate-400">
                                        {String(index + 1).padStart(2, '0')}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                                                <Tag className="w-5 h-5" />
                                            </div>
                                            <span className="font-bold text-slate-800">{category.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <code className="text-[11px] font-bold bg-slate-100 px-2 py-1 rounded text-slate-600">
                                            /{category.slug}
                                        </code>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5">
                                            <span className="font-bold text-slate-700">{category._count.products}</span>
                                            <span className="text-xs text-slate-400 uppercase font-bold tracking-tighter">Products</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right pr-8">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-blue-50 hover:text-blue-600" disabled>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-red-50 hover:text-red-500" disabled>
                                                <Trash className="h-4 w-4" />
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
