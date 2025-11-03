"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useDataStore } from "@/lib/data-store"

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const isAuthenticated = useDataStore((state) => state.isAuthenticated)

  useEffect(() => {
    // Allow access to login page without authentication
    if (pathname === "/login") {
      if (isAuthenticated) {
        router.push("/")
      }
      return
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, pathname, router])

  // Show loading or nothing while redirecting
  if (pathname !== "/login" && !isAuthenticated) {
    return null
  }

  // If on login page and authenticated, don't show content (will redirect)
  if (pathname === "/login" && isAuthenticated) {
    return null
  }

  return <>{children}</>
}
