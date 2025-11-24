"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, GraduationCap, ClipboardList, TrendingUp } from "lucide-react"
import {
  mockStudents,
  mockTeachers,
  mockGuardians,
  mockAssessments,
  mockDisciplines,
  mockClassrooms,
  mockSchoolClasses,
} from "@/lib/mock-data"

export default function DashboardPage() {
  const { user } = useAuth()

  const getStats = () => {
    if (user?.role === "admin") {
      return [
        {
          title: "Total de Alunos",
          value: mockStudents.filter((s) => s.status === "active").length,
          icon: GraduationCap,
          color: "text-blue-600",
          bgColor: "bg-blue-100",
        },
        {
          title: "Professores",
          value: mockTeachers.filter((t) => t.status === "active").length,
          icon: Users,
          color: "text-green-600",
          bgColor: "bg-green-100",
        },
        {
          title: "Turmas",
          value: mockClassrooms.filter((c) => c.status === "active").length,
          icon: Users,
          color: "text-purple-600",
          bgColor: "bg-purple-100",
        },
        {
          title: "Avaliações",
          value: mockAssessments.length,
          icon: ClipboardList,
          color: "text-orange-600",
          bgColor: "bg-orange-100",
        },
      ]
    }

    if (user?.role === "teacher") {
      const teacherDisciplines = mockDisciplines.filter((d) => d.teacherId === user.id)
      const teacherClassrooms = [...new Set(teacherDisciplines.map((d) => d.classroomId))]
      const teacherStudents = mockStudents.filter((s) => teacherClassrooms.includes(s.classroomId))
      const teacherAssessments = mockAssessments.filter((a) => teacherDisciplines.some((d) => d.id === a.disciplineId))
      const uniqueStudents = new Set(teacherAssessments.map((a) => a.studentId))

      return [
        {
          title: "Alunos",
          value: uniqueStudents.size,
          icon: GraduationCap,
          color: "text-blue-600",
          bgColor: "bg-blue-100",
        },
        {
          title: "Turmas",
          value: teacherClassrooms.length,
          icon: Users,
          color: "text-green-600",
          bgColor: "bg-green-100",
        },
        {
          title: "Avaliações Lançadas",
          value: teacherAssessments.length,
          icon: ClipboardList,
          color: "text-green-600",
          bgColor: "bg-green-100",
        },
        {
          title: "Média Geral",
          value:
            teacherAssessments.length > 0
              ? (
                  teacherAssessments.reduce((sum, a) => sum + (a.grade / a.maxGrade) * 20, 0) /
                  teacherAssessments.length
                ).toFixed(1)
              : "0",
          icon: TrendingUp,
          color: "text-purple-600",
          bgColor: "bg-purple-100",
        },
      ]
    }

    if (user?.role === "guardian") {
      const guardian = mockGuardians.find((g) => g.id === user.id)
      const students = mockStudents.filter((s) => guardian?.studentIds.includes(s.id))
      const studentAssessments = mockAssessments.filter((a) => students.some((s) => s.id === a.studentId))

      return [
        {
          title: "Educandos",
          value: students.length,
          icon: GraduationCap,
          color: "text-blue-600",
          bgColor: "bg-blue-100",
        },
        {
          title: "Avaliações",
          value: studentAssessments.length,
          icon: ClipboardList,
          color: "text-green-600",
          bgColor: "bg-green-100",
        },
        {
          title: "Média Geral",
          value:
            studentAssessments.length > 0
              ? (
                  studentAssessments.reduce((sum, a) => sum + (a.grade / a.maxGrade) * 20, 0) /
                  studentAssessments.length
                ).toFixed(1)
              : "0",
          icon: TrendingUp,
          color: "text-purple-600",
          bgColor: "bg-purple-100",
        },
      ]
    }

    if (user?.role === "student") {
      const student = mockStudents.find((s) => s.id === user.studentId)
      const studentAssessments = student ? mockAssessments.filter((a) => a.studentId === student.id) : []

      return [
        {
          title: "Aluno",
          value: student ? 1 : 0,
          icon: GraduationCap,
          color: "text-blue-600",
          bgColor: "bg-blue-100",
        },
        {
          title: "Avaliações",
          value: studentAssessments.length,
          icon: ClipboardList,
          color: "text-green-600",
          bgColor: "bg-green-100",
        },
        {
          title: "Média Geral",
          value:
            studentAssessments.length > 0
              ? (
                  studentAssessments.reduce((sum, a) => sum + (a.grade / a.maxGrade) * 20, 0) /
                  studentAssessments.length
                ).toFixed(1)
              : "0",
          icon: TrendingUp,
          color: "text-purple-600",
          bgColor: "bg-purple-100",
        },
      ]
    }

    return []
  }

  const stats = getStats()

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-balance">Bem-vindo, {user?.name}</h1>
            <p className="text-muted-foreground mt-1">
              {user?.role === "admin" && "Painel de administração do sistema"}
              {user?.role === "teacher" && "Gerencie suas disciplinas e avaliações"}
              {user?.role === "guardian" && "Acompanhe o desempenho dos seus educandos"}
              {user?.role === "student" && "Veja as suas notas, pautas e médias"}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {user?.role === "admin" && (
            <Card>
              <CardHeader>
                <CardTitle>Visão Geral do Sistema</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b">
                    <span className="text-sm font-medium">Classes</span>
                    <span className="text-sm text-muted-foreground">
                      {mockSchoolClasses.filter((c) => c.status === "active").length} de {mockSchoolClasses.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b">
                    <span className="text-sm font-medium">Turmas Ativas</span>
                    <span className="text-sm text-muted-foreground">
                      {mockClassrooms.filter((c) => c.status === "active").length} de {mockClassrooms.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b">
                    <span className="text-sm font-medium">Alunos Ativos</span>
                    <span className="text-sm text-muted-foreground">
                      {mockStudents.filter((s) => s.status === "active").length} de {mockStudents.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b">
                    <span className="text-sm font-medium">Professores Ativos</span>
                    <span className="text-sm text-muted-foreground">
                      {mockTeachers.filter((t) => t.status === "active").length} de {mockTeachers.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-sm font-medium">Avaliações Registradas</span>
                    <span className="text-sm text-muted-foreground">{mockAssessments.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
