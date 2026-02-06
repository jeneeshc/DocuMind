"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Database, ScanLine, BrainCircuit, Activity } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  const tools = [
    {
      label: "Digital Data Transformation",
      icon: Database,
      href: "/stream-a",
      color: "text-violet-500",
      bgColor: "bg-violet-500/10",
      desc: "Transform structured data (CSV/XLS) using LLM-generated Python logic."
    },
    {
      label: "Structured Document Intelligence",
      icon: ScanLine,
      href: "/stream-b",
      color: "text-pink-700",
      bgColor: "bg-pink-700/10",
      desc: "Process fixed-layout PDFs with automatic error correction."
    },
    {
      label: "Semantic Text Analysis",
      icon: BrainCircuit,
      href: "/stream-c",
      color: "text-orange-700",
      bgColor: "bg-orange-700/10",
      desc: "Intelligent RAG for large unstructured contracts and agreements."
    },
  ]

  return (
    <div className="p-8 space-y-8 h-full bg-slate-50/50">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h2>
        <p className="text-muted-foreground text-gray-500">
          Overview of your document processing pipelines.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass border-l-4 border-l-cyan-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Processed</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,284</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="glass border-l-4 border-l-violet-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stream A Usage</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">842</div>
          </CardContent>
        </Card>
        <Card className="glass border-l-4 border-l-pink-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stream B Usage</CardTitle>
            <ScanLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">311</div>
          </CardContent>
        </Card>
        <Card className="glass border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stream C Usage</CardTitle>
            <BrainCircuit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">131</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link href={tool.href} key={tool.href} className="h-full block">
            <Card className="p-4 border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer glass h-full">
              <div className="flex items-center gap-x-4">
                <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                  <tool.icon className={cn("w-8 h-8", tool.color)} />
                </div>
                <div>
                  <div className="font-semibold">{tool.label}</div>
                  <div className="text-xs text-gray-500 max-w-[200px]">{tool.desc}</div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5" />
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
