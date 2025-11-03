import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AppSidebar } from "@/components/app-sidebar"
import { AuthWrapper } from "@/components/auth-wrapper"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "EscolaHub - Sistema de Gestão Escolar",
  description: "Sistema completo de gestão escolar para notas e avaliações",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>A carregar...</div>}>
          <AuthWrapper>
            <LayoutContent>{children}</LayoutContent>
          </AuthWrapper>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto bg-background p-8">{children}</main>
    </div>
  )
}
