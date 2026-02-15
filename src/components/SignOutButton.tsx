"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function SignOutButton() {
    return (
        <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-slate-500 hover:text-red-600 hover:bg-red-50 h-9 rounded-lg font-medium text-[0.85rem]"
            onClick={() => signOut({ callbackUrl: "/login" })}
        >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
        </Button>
    )
}
