"use client"

import type React from "react"
import { FileText } from "lucide-react"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LayoutDashboard, Users, GraduationCap, UserCircle, ClipboardList, LogOut, Menu, BookOpen } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const getNavigationItems = () => {
    if (!user) return []

    const baseItems = [{ href: "/dashboard", label: "Painel", icon: LayoutDashboard }]

    if (user.role === "admin") {
      return [
        ...baseItems,
        { href: "/dashboard/classes", label: "Classes", icon: BookOpen },
        { href: "/dashboard/classrooms", label: "Turmas", icon: Users },
        { href: "/dashboard/subjects", label: "Disciplinas (Base)", icon: BookOpen },
        { href: "/dashboard/disciplines", label: "Disciplinas por Turma", icon: ClipboardList },
        { href: "/dashboard/students", label: "Alunos", icon: GraduationCap },
        { href: "/dashboard/teachers", label: "Professores", icon: Users },
        { href: "/dashboard/guardians", label: "Encarregados", icon: UserCircle },
        { href: "/dashboard/assessments", label: "Avaliações", icon: ClipboardList },
        { href: "/dashboard/teacher-attendance", label: "Presença Prof.", icon: Users },
        { href: "/dashboard/bulletin", label: "Boletins", icon: FileText },
      ]
    }

    if (user.role === "teacher") {
      return [
        ...baseItems,
        { href: "/dashboard/students", label: "Alunos", icon: GraduationCap },
        { href: "/dashboard/grades", label: "Lançar Notas", icon: ClipboardList },
        { href: "/dashboard/attendance", label: "Presenças", icon: Users },
      ]
    }

    if (user.role === "guardian" || user.role === "student") {
      return [
        ...baseItems,
        { href: "/dashboard/reports", label: "Relatórios", icon: ClipboardList },
        { href: "/dashboard/bulletin", label: "Boletins", icon: FileText },
      ]
    }

    return baseItems
  }

  const navItems = getNavigationItems()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-lg">Sistema Escolar</span>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">{user?.name.charAt(0)}</span>
                  </div>
                  <span className="hidden sm:inline">{user?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {user?.role === "admin" && "Administrador"}
                      {user?.role === "teacher" && "Professor"}
                      {user?.role === "guardian" && "Encarregado"}
                      {user?.role === "student" && "Aluno"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Trocar de Utilizador
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:pt-16 bg-white border-r border-gray-200">
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button variant="ghost" className="w-full justify-start gap-3">
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileMenuOpen(false)}>
            <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 pt-20">
              <nav className="flex-1 px-4 py-6 space-y-1">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start gap-3">
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </nav>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 lg:pl-64 pt-0">
          <div className="px-4 sm:px-6 lg:px-8 py-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
