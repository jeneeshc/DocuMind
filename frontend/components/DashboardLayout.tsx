"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="h-full relative">
            <div className={`hidden h-full md:flex md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900 transition-all duration-300 ${isCollapsed ? "w-20" : "w-72"}`}>
                <Sidebar isCollapsed={isCollapsed} onCollapse={() => setIsCollapsed(!isCollapsed)} />
            </div>
            <main className={`h-full min-h-screen bg-[#0B1121] transition-all duration-300 ${isCollapsed ? "md:pl-20" : "md:pl-72"}`}>
                {children}
            </main>
        </div>
    );
}
