"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Database, ScanLine, BrainCircuit, Activity } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  const tools = [
    {
      label: "Logic Synthesis",
      icon: Database,
      href: "/stream-a",
      color: "text-white",
      bgColor: "bg-slate-800",
      desc: "Stream A: Structured data transformation (XLSX, CSV)."
    },
    {
      label: "Self-Healing",
      icon: ScanLine,
      href: "/stream-b",
      color: "text-gray-200",
      bgColor: "bg-gray-800",
      desc: "Stream B: Fixed-layout forms with Referee Agent."
    },
    {
      label: "Visual Extraction",
      icon: BrainCircuit,
      href: "/stream-c",
      color: "text-zinc-200",
      bgColor: "bg-zinc-800",
      desc: "Stream C: Semi-structured/complex visual documents."
    },
    {
      label: "Semantic Pruning",
      icon: Database,
      href: "/stream-d",
      color: "text-slate-200",
      bgColor: "bg-slate-900",
      desc: "Stream D: Unstructured text using RAG-Light."
    },
  ]

  return (
    <div className="p-8 space-y-8 h-full bg-[#0B1121]">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-white">Intelligent Orchestrator</h2>
        <p className="text-muted-foreground text-gray-400">
          Hybrid AI orchestration framework for document intelligence.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="bg-gray-800/40 border-gray-700 border-l-4 border-l-blue-400 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orchestrator</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground">Cascade Classification Mode</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/40 border-gray-700 border-l-4 border-l-slate-400 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stream A</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100%</div>
            <p className="text-xs text-muted-foreground">Accuracy (Logic Synthesis)</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/40 border-gray-700 border-l-4 border-l-gray-400 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stream B</CardTitle>
            <ScanLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98%</div>
            <p className="text-xs text-muted-foreground">F2-Score (Self-Healing)</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/40 border-gray-700 border-l-4 border-l-zinc-400 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stream C</CardTitle>
            <BrainCircuit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">Extraction Rate</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/40 border-gray-700 border-l-4 border-l-slate-400 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stream D</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">90%</div>
            <p className="text-xs text-muted-foreground">Context Pruning</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {tools.map((tool) => (
          <Link href={tool.href} key={tool.href} className="h-full block">
            <Card className="p-4 border-white/5 bg-gray-800/50 text-white flex flex-col justify-between hover:shadow-md transition cursor-pointer h-full hover:bg-gray-800">
              <div className="flex items-center gap-x-4 mb-4">
                <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                  <tool.icon className={cn("w-8 h-8", tool.color)} />
                </div>
                <div>
                  <div className="font-semibold">{tool.label}</div>
                </div>
              </div>
              <div className="text-xs text-gray-400 mb-4">{tool.desc}</div>
              <div className="flex items-center justify-end">
                <ArrowRight className="w-5 h-5" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
