"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  BookOpen,
  Users,
  GraduationCap,
  ClipboardList,
  BarChart3,
  FileText,
  Bell,
  LogOut,
  Calculator,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useDataStore } from "@/lib/data-store"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Painel", href: "/", icon: LayoutDashboard },
  { name: "Disciplinas", href: "/subjects", icon: BookOpen },
  { name: "Turmas", href: "/classes", icon: Users },
  { name: "Alunos", href: "/students", icon: GraduationCap },
  { name: "Avaliações", href: "/assessments", icon: ClipboardList },
  { name: "Notas", href: "/grades", icon: FileText },
  { name: "Médias", href: "/medias", icon: Calculator },
  { name: "Análises", href: "/analytics", icon: BarChart3 },
  { name: "Notificações", href: "/notifications", icon: Bell },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const user = useDataStore((state) => state.user)
  const logout = useDataStore((state) => state.logout)

  if (pathname === "/login") {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <div className="flex h-screen w-64 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center border-b border-border px-6">
        <GraduationCap className="h-8 w-8 text-primary" />
        <span className="ml-3 text-xl font-semibold text-foreground">EscolaHub</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <span className="text-sm font-semibold">
              {user?.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase() || "AD"}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">{user?.name || "Administrador"}</p>
            <p className="text-xs text-muted-foreground">{user?.email || "admin@escola.com"}</p>
          </div>
        </div>
        <Button onClick={handleLogout} variant="outline" size="sm" className="w-full bg-transparent">
          <LogOut className="mr-2 h-4 w-4" />
          Terminar sessão
        </Button>
      </div>
    </div>
  )
}
