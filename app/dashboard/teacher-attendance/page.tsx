"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Calendar, Check, X, Search } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { mockTeachers, mockTeacherAttendance } from "@/lib/mock-data"
import type { TeacherAttendance } from "@/lib/types"

export default function TeacherAttendancePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [attendance, setAttendance] = useState<TeacherAttendance[]>(mockTeacherAttendance)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [searchTerm, setSearchTerm] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)

  // Redirect if not admin
  if (user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Acesso restrito apenas para administradores.</AlertDescription>
        </Alert>
      </div>
    )
  }

  const handleAttendanceChange = (teacherId: string, status: "presente" | "falta" | "justificado") => {
    const existing = attendance.find((a) => a.teacherId === teacherId && a.date === selectedDate)

    if (existing) {
      setAttendance(attendance.map((a) => (a.id === existing.id ? { ...a, status } : a)))
    } else {
      const newAttendance: TeacherAttendance = {
        id: `tatt${Date.now()}`,
        teacherId,
        date: selectedDate,
        status,
      }
      setAttendance([...attendance, newAttendance])
    }
  }

  const getAttendanceStatus = (teacherId: string) => {
    return attendance.find((a) => a.teacherId === teacherId && a.date === selectedDate)?.status
  }

  const getAttendanceStats = () => {
    const todayAttendance = attendance.filter((a) => a.date === selectedDate)
    const present = todayAttendance.filter((a) => a.status === "presente").length
    const absent = todayAttendance.filter((a) => a.status === "falta").length
    const justified = todayAttendance.filter((a) => a.status === "justificado").length

    return { present, absent, justified, total: todayAttendance.length }
  }

  const stats = getAttendanceStats()

  const filteredTeachers = mockTeachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Presença de Professores</h1>
              <p className="text-muted-foreground mt-1">Registre a presença dos professores</p>
            </div>
          </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Professores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTeachers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Presentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.present}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600">Faltas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-600">Justificados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.justified}</div>
          </CardContent>
        </Card>
      </div>

      {/* Date Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Seleccione a Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Search Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Filtrar Professores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Presenças do Dia {new Date(selectedDate).toLocaleDateString("pt-AO")}</CardTitle>
          <CardDescription>Clique nos botões para registar presença</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTeachers.map((teacher) => {
              const status = getAttendanceStatus(teacher.id)
              return (
                <div key={teacher.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{teacher.name}</p>
                    <p className="text-sm text-gray-600">{teacher.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAttendanceChange(teacher.id, "presente")}
                      className={`gap-2 ${status === "presente" ? "bg-green-600 hover:bg-green-700" : "bg-gray-200 hover:bg-gray-300"}`}
                      variant={status === "presente" ? "default" : "outline"}
                    >
                      <Check className="h-4 w-4" />
                      Presente
                    </Button>
                    <Button
                      onClick={() => handleAttendanceChange(teacher.id, "falta")}
                      className={`gap-2 ${status === "falta" ? "bg-red-600 hover:bg-red-700" : "bg-gray-200 hover:bg-gray-300"}`}
                      variant={status === "falta" ? "default" : "outline"}
                    >
                      <X className="h-4 w-4" />
                      Falta
                    </Button>
                    <Button
                      onClick={() => handleAttendanceChange(teacher.id, "justificado")}
                      className={`gap-2 ${status === "justificado" ? "bg-yellow-600 hover:bg-yellow-700" : "bg-gray-200 hover:bg-gray-300"}`}
                      variant={status === "justificado" ? "default" : "outline"}
                    >
                      Justificado
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
    </DashboardLayout>
    </ProtectedRoute>
  )
}
