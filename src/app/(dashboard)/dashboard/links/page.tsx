import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { LinkGenerator } from "@/components/LinkGenerator"
import { CopyLinkButton } from "@/components/CopyLinkButton"

export default async function LinksPage() {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    const links = await prisma.affiliateLink.findMany({
        where: { userId },
        include: {
            product: true,
            _count: { select: { clicks: true } },
        },
        orderBy: { createdAt: "desc" },
    })

    const products = await prisma.product.findMany({
        select: { id: true, name: true, price: true, commission: true },
        orderBy: { name: "asc" },
    })

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Affiliate Links</h2>
                <p className="text-muted-foreground">Generate and manage your tracking links.</p>
            </div>

            <LinkGenerator products={products} />

            <Card>
                <CardHeader>
                    <CardTitle>Your Links ({links.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {links.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            No affiliate links yet. Use the generator above to create your first link!
                        </p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Affiliate Code</TableHead>
                                    <TableHead>Clicks</TableHead>
                                    <TableHead>Commission</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {links.map((link) => (
                                    <TableRow key={link.id}>
                                        <TableCell className="font-medium">{link.product.name}</TableCell>
                                        <TableCell>
                                            <code className="text-xs bg-muted px-2 py-1 rounded">{link.code}</code>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{link._count.clicks}</Badge>
                                        </TableCell>
                                        <TableCell className="text-emerald-600 font-medium">
                                            {link.product.commission}%
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {link.createdAt.toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <CopyLinkButton
                                                productId={link.productId}
                                                code={link.code}
                                            />
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
