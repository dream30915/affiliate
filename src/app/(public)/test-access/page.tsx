import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TestAccessPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-50">
            <div className="p-8 bg-white rounded-2xl shadow-xl border border-slate-200 text-center max-w-md w-full">
                <h1 className="text-2xl font-bold text-slate-900 mb-4">
                    Access Test Page 🚀
                </h1>
                <p className="text-slate-600 mb-8">
                    If you can see this page, it means the automated agent successfully created and deployed it.
                </p>
                <div className="flex flex-col gap-4">
                    <Button className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700 transition-all shadow-md shadow-blue-200">
                        Permission Verified!
                    </Button>
                    <Link href="/" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
                        Return to Homepage
                    </Link>
                </div>
            </div>
        </div>
    );
}
