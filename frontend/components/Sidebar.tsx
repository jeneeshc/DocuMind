"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    FileText,
    Settings,
    Database,
    ScanLine,
    BrainCircuit,
    PanelLeft,
    Info
} from "lucide-react"

interface SidebarProps {
    isCollapsed: boolean;
    onCollapse: () => void;
}

export function Sidebar({ isCollapsed, onCollapse }: SidebarProps) {
    const pathname = usePathname()

    const routes = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/",
            color: "text-slate-300",
        },
        {
            label: "Stream A: Logic Synthesis",
            icon: Database,
            href: "/stream-a",
            color: "text-gray-300",
        },
        {
            label: "Stream B: Self-Healing",
            icon: ScanLine,
            href: "/stream-b",
            color: "text-zinc-300",
        },
        {
            label: "Stream C: Visual Extraction",
            icon: BrainCircuit,
            href: "/stream-c",
            color: "text-slate-300",
        },
        {
            label: "Stream D: Semantic Pruning",
            icon: Database,
            href: "/stream-d",
            color: "text-gray-300",
        },
        {
            label: "Settings",
            icon: Settings,
            href: "/settings",
        },
        {
            label: "About",
            icon: Info,
            href: "/about",
            color: "text-gray-500",
        },
    ]

    return (
        <div className={cn("space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white transition-all duration-300", isCollapsed ? "w-20" : "w-72")}>
            <div className="px-3 py-2 flex-1">
                <div className={cn("flex items-center mb-14", isCollapsed ? "justify-center flex-col gap-y-4" : "pl-3 justify-between")}>
                    <Link href="/" className="flex items-center">
                        <div className="relative w-8 h-8 mr-4">
                            <BrainCircuit className="w-8 h-8 text-white" />
                        </div>
                        {!isCollapsed && (
                            <h1 className="text-2xl font-bold text-white whitespace-nowrap">
                                DocuMind
                            </h1>
                        )}
                    </Link>
                    <button
                        onClick={onCollapse}
                        className={cn("text-zinc-400 hover:text-white transition", isCollapsed ? "" : "ml-auto")}
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
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400",
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
