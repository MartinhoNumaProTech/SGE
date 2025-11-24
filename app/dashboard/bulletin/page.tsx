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
import {
  mockStudents,
  mockAssessments,
  mockDisciplines,
  mockSubjects,
  mockClassrooms,
  mockAttendance,
} from "@/lib/mock-data"
import { Download } from "lucide-react"

const calculateStatsHelper = (assessments: any[]) => {
  if (assessments.length === 0) return { average: 0, count: 0 }
  const average = assessments.reduce((sum, a) => sum + (a.grade / a.maxGrade) * 100, 0) / assessments.length
  return { average: average.toFixed(2), count: assessments.length }
}

const generateBulletinHTML = (studentData: any, assessments: any[], attendance: any[]) => {
  const stats = calculateStatsHelper(assessments)
  const attendanceCount = attendance.filter((a: any) => a.status === "presente").length
  const attendancePercentage = attendance.length > 0 ? ((attendanceCount / attendance.length) * 100).toFixed(1) : 0

  const assessmentRows = assessments
    .map((a: any) => {
      const discipline = mockDisciplines.find((d) => d.id === a.disciplineId)
      const subject = mockSubjects.find((s) => s.id === discipline?.subjectId)
      return `<tr><td>${subject?.name || "N/A"}</td><td><strong>${a.grade}/${a.maxGrade}</strong></td><td>${a.type}</td><td>${new Date(a.date).toLocaleDateString("pt-PT")}</td></tr>`
    })
    .join("")

  const attendanceRows = attendance
    .slice(0, 10)
    .map((a: any) => {
      const discipline = mockDisciplines.find((d) => d.id === a.disciplineId)
      const subject = mockSubjects.find((s) => s.id === discipline?.subjectId)
      return `<tr><td>${subject?.name || "N/A"}</td><td>${new Date(a.date).toLocaleDateString("pt-PT")}</td><td>${a.status}</td></tr>`
    })
    .join("")

  const html = `<!DOCTYPE html><html lang="pt"><head><meta charset="UTF-8"><title>Boletim de ${studentData.name}</title><style>* { margin: 0; padding: 0; box-sizing: border-box; } body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; } .container { max-width: 800px; margin: 0 auto; padding: 20px; } .header { text-align: center; border-bottom: 3px solid #1e40af; padding-bottom: 15px; margin-bottom: 20px; } .header h1 { color: #1e40af; font-size: 24px; margin-bottom: 5px; } .header p { color: #666; font-size: 14px; } .student-info { background: #f0f4f8; padding: 15px; border-radius: 8px; margin-bottom: 20px; } .student-info h2 { color: #1e40af; font-size: 16px; margin-bottom: 10px; } .info-row { display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 14px; } .section { margin-bottom: 25px; } .section h3 { color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 8px; margin-bottom: 12px; font-size: 16px; } table { width: 100%; border-collapse: collapse; margin-top: 10px; } th { background: #1e40af; color: white; padding: 10px; text-align: left; font-weight: bold; } td { padding: 10px; border-bottom: 1px solid #ddd; font-size: 14px; } tr:last-child td { border-bottom: 2px solid #1e40af; } .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-top: 15px; } .stat-card { background: #f0f4f8; padding: 15px; border-radius: 8px; text-align: center; } .stat-value { font-size: 24px; font-weight: bold; color: #1e40af; } .stat-label { color: #666; font-size: 12px; margin-top: 5px; } .footer { text-align: center; border-top: 1px solid #ddd; padding-top: 15px; margin-top: 25px; font-size: 12px; color: #666; }</style></head><body><div class="container"><div class="header"><h1>BOLETIM ESCOLAR</h1><p>Sistema de Gestão Escolar</p></div><div class="student-info"><h2>Informações do Aluno</h2><div class="info-row"><strong>Nome:</strong> ${studentData.name}</div><div class="info-row"><strong>Turma:</strong> ${mockClassrooms.find((c: any) => c.id === studentData.classroomId)?.name}</div><div class="info-row"><strong>Data de Nascimento:</strong> ${new Date(studentData.dateOfBirth).toLocaleDateString("pt-PT")}</div></div><div class="stats"><div class="stat-card"><div class="stat-value">${stats.average}%</div><div class="stat-label">Média Geral</div></div><div class="stat-card"><div class="stat-value">${stats.count}</div><div class="stat-label">Avaliações</div></div><div class="stat-card"><div class="stat-value">${attendancePercentage}%</div><div class="stat-label">Presença</div></div></div><div class="section"><h3>Desempenho por Disciplina</h3><table><thead><tr><th>Disciplina</th><th>Nota</th><th>Tipo</th><th>Data</th></tr></thead><tbody>${assessmentRows}</tbody></table></div><div class="section"><h3>Resumo de Presença</h3><table><thead><tr><th>Disciplina</th><th>Data</th><th>Status</th></tr></thead><tbody>${attendanceRows}</tbody></table></div><div class="footer"><p>Documento gerado em ${new Date().toLocaleDateString("pt-PT")} às ${new Date().toLocaleTimeString("pt-PT")}</p></div></div></body></html>`
  return html
}

export default function BulletinPage() {
  const { user } = useAuth()
  const router = useRouter()
  const isGuardian = user?.role === "guardian"
  const isStudent = user?.role === "student"
  const [selectedStudent, setSelectedStudent] = useState(isStudent ? user?.studentId || "" : "")

  // If the logged user is a student, show their own bulletin (no select required)
  if (isStudent) {
    const selectedStudentData = mockStudents.find((s) => s.id === user?.studentId)
    const studentAssessments = selectedStudentData
      ? mockAssessments.filter((a) => a.studentId === selectedStudentData.id)
      : []
    const studentAttendance = selectedStudentData
      ? mockAttendance.filter((a) => a.studentId === selectedStudentData.id)
      : []

    const stats = calculateStatsHelper(studentAssessments)
    const attendanceCount = studentAttendance.filter((a) => a.status === "presente").length
    const attendancePercentage =
      studentAttendance.length > 0 ? ((attendanceCount / studentAttendance.length) * 100).toFixed(1) : 0

    const generatePDF = () => {
      if (!selectedStudentData) return
      const htmlContent = generateBulletinHTML(selectedStudentData, studentAssessments, studentAttendance)
      const printWindow = window.open("", "", "width=800,height=600")
      if (printWindow) {
        printWindow.document.write(htmlContent)
        printWindow.document.close()
        printWindow.print()
      }
    }

    return (
      <ProtectedRoute allowedRoles={["student"]}>
        <DashboardLayout>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Boletim Escolar</h1>
              <p className="text-muted-foreground">Visualize o seu boletim</p>
            </div>

            {selectedStudentData ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Estatísticas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{stats.average}%</div>
                        <div className="text-xs text-muted-foreground">Média Geral</div>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{stats.count}</div>
                        <div className="text-xs text-muted-foreground">Avaliações</div>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{attendancePercentage}%</div>
                        <div className="text-xs text-muted-foreground">Taxa de Presença</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Boletim</CardTitle>
                    <CardDescription>Desempenho e presença</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-3">Avaliações Recentes</h3>
                      {studentAssessments.length > 0 ? (
                        <div className="space-y-2">
                          {studentAssessments.map((assessment) => {
                            const discipline = mockDisciplines.find((d) => d.id === assessment.disciplineId)
                            const subject = mockSubjects.find((s) => s.id === discipline?.subjectId)
                            return (
                              <div key={assessment.id} className="flex items-center justify-between p-2 border rounded">
                                <div>
                                  <p className="font-medium text-sm">{subject?.name}</p>
                                  <p className="text-xs text-muted-foreground">{assessment.type}</p>
                                </div>
                                <Badge>
                                  {assessment.grade}/{assessment.maxGrade}
                                </Badge>
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">Nenhuma avaliação registrada.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-2">
                  <Button onClick={generatePDF} className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar para PDF
                  </Button>
                </div>
              </>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Nenhum dado do aluno encontrado</p>
                </CardContent>
              </Card>
            )}
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  if (user?.role === "guardian") {
    const selectedStudentData = mockStudents.find((s) => s.id === selectedStudent)
    const studentAssessments = selectedStudentData
      ? mockAssessments.filter((a) => a.studentId === selectedStudentData.id)
      : []
    const studentAttendance = selectedStudentData
      ? mockAttendance.filter((a) => a.studentId === selectedStudentData.id)
      : []

    const stats = calculateStatsHelper(studentAssessments)
    const attendanceCount = studentAttendance.filter((a) => a.status === "presente").length
    const attendancePercentage =
      studentAttendance.length > 0 ? ((attendanceCount / studentAttendance.length) * 100).toFixed(1) : 0

    const generatePDF = () => {
      if (!selectedStudentData) return
      const htmlContent = generateBulletinHTML(selectedStudentData, studentAssessments, studentAttendance)
      const printWindow = window.open("", "", "width=800,height=600")
      if (printWindow) {
        printWindow.document.write(htmlContent)
        printWindow.document.close()
        printWindow.print()
      }
    }

    return (
      <ProtectedRoute allowedRoles={["admin", "guardian", "student"]}>
        <DashboardLayout>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Boletim Escolar</h1>
              <p className="text-muted-foreground">Visualize e exporte o boletim do seu aluno</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Selecionar Aluno</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Aluno</label>
                  <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um aluno" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockStudents.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name} - {mockClassrooms.find((c) => c.id === student.classroomId)?.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {selectedStudent && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Estatísticas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{stats.average}%</div>
                        <div className="text-xs text-muted-foreground">Média Geral</div>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{stats.count}</div>
                        <div className="text-xs text-muted-foreground">Avaliações</div>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{attendancePercentage}%</div>
                        <div className="text-xs text-muted-foreground">Taxa de Presença</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Boletim</CardTitle>
                    <CardDescription>Desempenho e presença</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-3">Avaliações Recentes</h3>
                      {studentAssessments.length > 0 ? (
                        <div className="space-y-2">
                          {studentAssessments.map((assessment) => {
                            const discipline = mockDisciplines.find((d) => d.id === assessment.disciplineId)
                            const subject = mockSubjects.find((s) => s.id === discipline?.subjectId)
                            return (
                              <div key={assessment.id} className="flex items-center justify-between p-2 border rounded">
                                <div>
                                  <p className="font-medium text-sm">{subject?.name}</p>
                                  <p className="text-xs text-muted-foreground">{assessment.type}</p>
                                </div>
                                <Badge>
                                  {assessment.grade}/{assessment.maxGrade}
                                </Badge>
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">Nenhuma avaliação registrada.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-2">
                  <Button onClick={generatePDF} className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar para PDF
                  </Button>
                </div>
              </>
            )}
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  if (user?.role === "admin") {
    const selectedStudentData = mockStudents.find((s) => s.id === selectedStudent)
    const studentAssessments = selectedStudentData
      ? mockAssessments.filter((a) => a.studentId === selectedStudentData.id)
      : []
    const studentAttendance = selectedStudentData
      ? mockAttendance.filter((a) => a.studentId === selectedStudentData.id)
      : []

    const stats = calculateStatsHelper(studentAssessments)
    const attendanceCount = studentAttendance.filter((a) => a.status === "presente").length
    const attendancePercentage =
      studentAttendance.length > 0 ? ((attendanceCount / studentAttendance.length) * 100).toFixed(1) : 0

    const generatePDF = () => {
      if (!selectedStudentData) return
      const htmlContent = generateBulletinHTML(selectedStudentData, studentAssessments, studentAttendance)
      const printWindow = window.open("", "", "width=800,height=600")
      if (printWindow) {
        printWindow.document.write(htmlContent)
        printWindow.document.close()
        printWindow.print()
      }
    }

    return (
      <ProtectedRoute allowedRoles={["admin", "guardian", "student"]}>
        <DashboardLayout>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Boletim Escolar</h1>
              <p className="text-muted-foreground">Visualize e exporte boletins dos alunos</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Selecionar Aluno</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Aluno</label>
                  <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um aluno" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockStudents.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name} - {mockClassrooms.find((c) => c.id === student.classroomId)?.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {selectedStudent && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Estatísticas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{stats.average}%</div>
                        <div className="text-xs text-muted-foreground">Média Geral</div>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{stats.count}</div>
                        <div className="text-xs text-muted-foreground">Avaliações</div>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{attendancePercentage}%</div>
                        <div className="text-xs text-muted-foreground">Taxa de Presença</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Boletim</CardTitle>
                    <CardDescription>Desempenho e presença</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-3">Avaliações Recentes</h3>
                      {studentAssessments.length > 0 ? (
                        <div className="space-y-2">
                          {studentAssessments.map((assessment) => {
                            const discipline = mockDisciplines.find((d) => d.id === assessment.disciplineId)
                            const subject = mockSubjects.find((s) => s.id === discipline?.subjectId)
                            return (
                              <div key={assessment.id} className="flex items-center justify-between p-2 border rounded">
                                <div>
                                  <p className="font-medium text-sm">{subject?.name}</p>
                                  <p className="text-xs text-muted-foreground">{assessment.type}</p>
                                </div>
                                <Badge>
                                  {assessment.grade}/{assessment.maxGrade}
                                </Badge>
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">Nenhuma avaliação registrada.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-2">
                  <Button onClick={generatePDF} className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar para PDF
                  </Button>
                </div>
              </>
            )}
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

    return (
      <ProtectedRoute allowedRoles={["admin", "guardian", "student"]}>
      <DashboardLayout>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              Acesso negado. Boletins estão disponíveis para Admin e Guardiões.
            </p>
          </CardContent>
        </Card>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
