"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function TestingRedirect() {
    const router = useRouter()
    useEffect(() => { router.replace("/data-governance") }, [router])
    return null
}
