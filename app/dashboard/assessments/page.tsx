"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Download, TrendingUp, Users, BookOpen } from "lucide-react"
import { mockAssessments, mockStudents, mockTeachers, mockDisciplines, mockSubjects } from "@/lib/mock-data"
import type { Assessment } from "@/lib/types"

export default function AssessmentsPage() {
  const [assessments] = useState<Assessment[]>(mockAssessments)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterSubject, setFilterSubject] = useState<string>("all")
  const [filterTrimester, setFilterTrimester] = useState<string>("all")
  const [filterType, setFilterType] = useState<string>("all")

  const getSubjectName = (disciplineId: string) => {
    const discipline = mockDisciplines.find((d) => d.id === disciplineId)
    const subject = mockSubjects.find((s) => s.id === discipline?.subjectId)
    return subject?.name || "N/A"
  }

  const subjects = Array.from(new Set(assessments.map((a) => getSubjectName(a.disciplineId))))

  const filteredAssessments = assessments.filter((assessment) => {
    const student = mockStudents.find((s) => s.id === assessment.studentId)
    const subjectName = getSubjectName(assessment.disciplineId)

    const matchesSearch =
      student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subjectName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSubject = filterSubject === "all" || subjectName === filterSubject
    const matchesTrimester = filterTrimester === "all" || assessment.trimester.toString() === filterTrimester
    const matchesType = filterType === "all" || assessment.type === filterType

    return matchesSearch && matchesSubject && matchesTrimester && matchesType
  })

  const getStudentName = (studentId: string) => {
    const student = mockStudents.find((s) => s.id === studentId)
    return student?.name || "N/A"
  }

  const getTeacherName = (teacherId: string) => {
    const teacher = mockTeachers.find((t) => t.id === teacherId)
    return teacher?.name || "N/A"
  }

  const getTypeLabel = (type: string) => {
    const types = {
      prova: "Prova",
      trabalho: "Trabalho",
      participacao: "Participação",
    }
    return types[type as keyof typeof types] || type
  }

  const calculateStats = () => {
    const totalAssessments = assessments.length
    const averageGrade = assessments.reduce((sum, a) => sum + (a.grade / a.maxGrade) * 20, 0) / totalAssessments
    const uniqueStudents = new Set(assessments.map((a) => a.studentId)).size
    const uniqueSubjects = new Set(assessments.map((a) => getSubjectName(a.disciplineId))).size

    return {
      total: totalAssessments,
      average: averageGrade.toFixed(1),
      students: uniqueStudents,
      subjects: uniqueSubjects,
    }
  }

  const stats = calculateStats()

  const handleExport = () => {
    const csvContent = [
      [
        "Data",
        "Aluno",
        "Disciplina",
        "Tipo",
        "Nota",
        "Nota Máxima",
        "Percentual",
        "Trimestre",
        "Observações",
      ],
      ...filteredAssessments.map((a) => [
        new Date(a.date).toLocaleDateString("pt-AO"),
        getStudentName(a.studentId),
        getSubjectName(a.disciplineId),
        getTypeLabel(a.type),
        a.grade,
        a.maxGrade,
        ((a.grade / a.maxGrade) * 20).toFixed(1),
        `${a.trimester}º Trimestre`,
        a.comments || "",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `avaliacoes_${new Date().toISOString().split("T")[0]}.csv`
    link.click()
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Gestão de Avaliações</h1>
              <p className="text-muted-foreground mt-1">Visão geral de todas as avaliações do sistema</p>
            </div>
            <Button onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Exportar CSV
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total de Avaliações</CardTitle>
                <BookOpen className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Média Geral</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.average}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Alunos Avaliados</CardTitle>
                <Users className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.students}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Disciplinas</CardTitle>
                <BookOpen className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.subjects}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                <CardTitle>Filtros</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Buscar</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Aluno, professor ou disciplina..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Disciplina</label>
                  <Select value={filterSubject} onValueChange={setFilterSubject}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Trimestre</label>
                  <Select value={filterTrimester} onValueChange={setFilterTrimester}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="1">1º Trimestre</SelectItem>
                      <SelectItem value="2">2º Trimestre</SelectItem>
                      <SelectItem value="3">3º Trimestre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo</label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="prova">Prova</SelectItem>
                      <SelectItem value="trabalho">Trabalho</SelectItem>
                      <SelectItem value="participacao">Participação</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Avaliações ({filteredAssessments.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Aluno</TableHead>
                      <TableHead>Disciplina</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Nota</TableHead>
                      <TableHead>Trimestre</TableHead>
                      <TableHead>Observações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAssessments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                          Nenhuma avaliação encontrada
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAssessments
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((assessment) => (
                          <TableRow key={assessment.id}>
                            <TableCell>{new Date(assessment.date).toLocaleDateString("pt-AO")}</TableCell>
                            <TableCell className="font-medium">{getStudentName(assessment.studentId)}</TableCell>
                            <TableCell>{getSubjectName(assessment.disciplineId)}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{getTypeLabel(assessment.type)}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {assessment.grade}/{assessment.maxGrade}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {((assessment.grade / assessment.maxGrade) * 20).toFixed(1)}/20
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>{assessment.trimester}º Trim.</TableCell>
                            <TableCell className="max-w-xs truncate">{assessment.comments || "-"}</TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Análise por Disciplina</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subjects.map((subject) => {
                  const subjectAssessments = assessments.filter((a) => a.subject === subject)
                  const average =
                    subjectAssessments.reduce((sum, a) => sum + (a.grade / a.maxGrade) * 20, 0) /
                    subjectAssessments.length

                  return (
                    <div key={subject} className="flex items-center justify-between py-3 border-b last:border-0">
                      <div className="flex-1">
                        <p className="font-medium">{subject}</p>
                        <p className="text-sm text-muted-foreground">{subjectAssessments.length} avaliações</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(average / 20) * 100}%` }} />
                        </div>
                        <span className="text-lg font-bold w-12 text-right">{average.toFixed(1)}</span>
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
