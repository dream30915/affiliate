import { Suspense } from "react"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { ClickTracker } from "@/components/ClickTracker"

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <Suspense fallback={null}>
                <ClickTracker />
            </Suspense>
        </div>
    )
}
