"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    BrainCircuit,
    PanelLeft,
    Info,
    Activity
} from "lucide-react"

interface SidebarProps {
    isCollapsed: boolean;
    onCollapse: () => void;
}

export function Sidebar({ isCollapsed, onCollapse }: SidebarProps) {
    const pathname = usePathname()

    const routes = [
        {
            label: "Data Transformation",
            icon: BrainCircuit,
            href: "/",
            color: "text-blue-400",
        },
        {
            label: "Evaluation Suite",
            icon: Activity,
            href: "/testing",
            color: "text-emerald-400",
        },
        {
            label: "About",
            icon: Info,
            href: "/about",
            color: "text-gray-400",
        },
    ]

    return (
        <div className={cn("space-y-4 py-4 flex flex-col h-full bg-slate-50 text-slate-900 border-r border-slate-200 transition-all duration-300", isCollapsed ? "w-20" : "w-72")}>
            <div className="px-3 py-2 flex-1">
                <div className={cn("flex items-center mb-14", isCollapsed ? "justify-center flex-col gap-y-4" : "pl-3 justify-between")}>
                    <Link href="/" className="flex items-center">
                        <div className="relative w-8 h-8 mr-4">
                            <BrainCircuit className="w-8 h-8 text-blue-600" />
                        </div>
                        {!isCollapsed && (
                            <h1 className="text-2xl font-bold text-slate-900 whitespace-nowrap">
                                DocuMind
                            </h1>
                        )}
                    </Link>
                    <button
                        onClick={onCollapse}
                        className={cn("text-slate-500 hover:text-slate-900 transition", isCollapsed ? "" : "ml-auto")}
                    >
                        <PanelLeft className="w-6 h-6" />
                    </button>
                </div>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-slate-900 hover:bg-slate-200/50 rounded-lg transition",
                                pathname === route.href ? "text-slate-900 bg-slate-200 border border-slate-300 shadow-sm" : "text-slate-600",
                                isCollapsed && "justify-center"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5", route.color, !isCollapsed && "mr-3")} />
                                {!isCollapsed && route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
