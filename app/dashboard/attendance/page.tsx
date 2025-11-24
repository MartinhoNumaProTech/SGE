"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { mockDisciplines, mockStudents, mockSubjects, mockAttendance, mockClassrooms } from "@/lib/mock-data"
import { Save } from "lucide-react"

export default function AttendancePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [selectedDiscipline, setSelectedDiscipline] = useState("")
  const [attendanceData, setAttendanceData] = useState(mockAttendance)
  const [newAttendance, setNewAttendance] = useState<{
    studentId: string
    status: "presente" | "falta" | "justificado"
  } | null>(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])

  // Obter disciplinas do professor atual
  const teacherDisciplines = mockDisciplines.filter((d) => d.teacherId === user.id)

  const selectedDisciplineObj = mockDisciplines.find((d) => d.id === selectedDiscipline)
  const disciplineSubject = selectedDisciplineObj
    ? mockSubjects.find((s) => s.id === selectedDisciplineObj.subjectId)
    : null
  const disciplineClassroom = selectedDisciplineObj
    ? mockClassrooms.find((c) => c.id === selectedDisciplineObj.classroomId)
    : null

  const classroomStudents = selectedDisciplineObj
    ? mockStudents.filter((s) => s.classroomId === selectedDisciplineObj.classroomId && s.status === "active")
    : []

  const todayAttendance = attendanceData.filter(
    (a) =>
      a.disciplineId === selectedDiscipline &&
      a.date === selectedDate &&
      classroomStudents.find((s) => s.id === a.studentId),
  )

  const handleAddAttendance = (studentId: string, status: "presente" | "falta" | "justificado") => {
    const existingAttendance = attendanceData.find(
      (a) => a.studentId === studentId && a.disciplineId === selectedDiscipline && a.date === selectedDate,
    )

    if (existingAttendance) {
      setAttendanceData(attendanceData.map((a) => (a.id === existingAttendance.id ? { ...a, status } : a)))
    } else {
      setAttendanceData([
        ...attendanceData,
        {
          id: `att-${Date.now()}`,
          studentId,
          disciplineId: selectedDiscipline,
          date: selectedDate,
          status,
        },
      ])
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      presente: { bg: "bg-green-100", text: "text-green-800", label: "Presente" },
      falta: { bg: "bg-red-100", text: "text-red-800", label: "Falta" },
      justificado: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Justificado" },
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    return <Badge className={`${config.bg} ${config.text}`}>{config.label}</Badge>
  }

  return (
    <ProtectedRoute allowedRoles={["teacher"]}>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Lançamento de Presenças</h1>
            <p className="text-muted-foreground">Registre as presenças dos seus alunos por disciplina</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Selecionar Disciplina e Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Disciplina</label>
                  <Select value={selectedDiscipline} onValueChange={setSelectedDiscipline}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma disciplina" />
                    </SelectTrigger>
                    <SelectContent>
                      {teacherDisciplines.map((discipline) => {
                        const subject = mockSubjects.find((s) => s.id === discipline.subjectId)
                        const classroom = mockClassrooms.find((c) => c.id === discipline.classroomId)
                        return (
                          <SelectItem key={discipline.id} value={discipline.id}>
                            {subject?.name} - {classroom?.name}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Data</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
              </div>

              {selectedDisciplineObj && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm">
                    <p className="font-medium text-blue-900">{disciplineSubject?.name}</p>
                    <p className="text-xs text-blue-700">{disciplineClassroom?.name}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {selectedDiscipline && (
            <Card>
              <CardHeader>
                <CardTitle>Registro de Presenças</CardTitle>
                <CardDescription>
                  {classroomStudents.length} aluno(s) - {selectedDate}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {classroomStudents.length > 0 ? (
                    classroomStudents.map((student) => {
                      const studentAttendance = todayAttendance.find((a) => a.studentId === student.id)
                      return (
                        <div
                          key={student.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-sm">{student.name}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant={studentAttendance?.status === "presente" ? "default" : "outline"}
                              onClick={() => handleAddAttendance(student.id, "presente")}
                              className="text-xs"
                            >
                              Presente
                            </Button>
                            <Button
                              size="sm"
                              variant={studentAttendance?.status === "falta" ? "default" : "outline"}
                              onClick={() => handleAddAttendance(student.id, "falta")}
                              className="text-xs"
                            >
                              Falta
                            </Button>
                            <Button
                              size="sm"
                              variant={studentAttendance?.status === "justificado" ? "default" : "outline"}
                              onClick={() => handleAddAttendance(student.id, "justificado")}
                              className="text-xs"
                            >
                              Justificado
                            </Button>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhum aluno na turma.</p>
                  )}
                </div>

                <div className="flex gap-2 mt-6 pt-4 border-t">
                  <Button className="flex-1" onClick={() => alert("Presenças salvas!")}>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Presenças
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
