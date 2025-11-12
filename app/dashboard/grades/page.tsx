"use client"

import type React from "react"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Pencil, Trash2, Search, BookOpen } from "lucide-react"
import { mockAssessments, mockStudents, mockDisciplines, mockSubjects, mockClassrooms } from "@/lib/mock-data"
import type { Assessment } from "@/lib/types"
import { useAuth } from "@/contexts/auth-context"

export default function GradesPage() {
  const { user } = useAuth()
  const [assessments, setAssessments] = useState<Assessment[]>(mockAssessments)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(null)
  const [formData, setFormData] = useState({
    studentId: "",
    disciplineId: "",
    type: "prova" as "prova" | "trabalho" | "participacao",
    grade: "",
    maxGrade: "20",
    date: new Date().toISOString().split("T")[0],
    trimester: "1" as "1" | "2" | "3",
    comments: "",
  })

  const teacherDisciplines = mockDisciplines.filter((d) => d.teacherId === user?.id)
  const teacherClassrooms = [...new Set(teacherDisciplines.map((d) => d.classroomId))]
  const teacherAssessments = assessments.filter((a) => {
    const discipline = mockDisciplines.find((d) => d.id === a.disciplineId)
    return discipline?.teacherId === user?.id
  })

  const filteredAssessments = teacherAssessments.filter((assessment) => {
    const student = mockStudents.find((s) => s.id === assessment.studentId)
    const discipline = mockDisciplines.find((d) => d.id === assessment.disciplineId)
    const subject = mockSubjects.find((s) => s.id === discipline?.subjectId)
    return (
      student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject?.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const handleOpenDialog = (assessment?: Assessment) => {
    if (assessment) {
      setEditingAssessment(assessment)
      setFormData({
        studentId: assessment.studentId,
        disciplineId: assessment.disciplineId,
        type: assessment.type,
        grade: assessment.grade.toString(),
        maxGrade: assessment.maxGrade.toString(),
        date: assessment.date,
        trimester: assessment.trimester.toString() as "1" | "2" | "3",
        comments: assessment.comments || "",
      })
    } else {
      setEditingAssessment(null)
      setFormData({
        studentId: "",
        disciplineId: "",
        type: "prova",
        grade: "",
        maxGrade: "20",
        date: new Date().toISOString().split("T")[0],
        trimester: "1",
        comments: "",
      })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingAssessment) {
      setAssessments(
        assessments.map((a) =>
          a.id === editingAssessment.id
            ? {
                ...a,
                ...formData,
                grade: Number.parseFloat(formData.grade),
                maxGrade: Number.parseFloat(formData.maxGrade),
                trimester: Number.parseInt(formData.trimester) as 1 | 2 | 3,
              }
            : a,
        ),
      )
    } else {
      const newAssessment: Assessment = {
        id: `a${assessments.length + 1}`,
        studentId: formData.studentId,
        disciplineId: formData.disciplineId,
        type: formData.type,
        grade: Number.parseFloat(formData.grade),
        maxGrade: Number.parseFloat(formData.maxGrade),
        date: formData.date,
        trimester: Number.parseInt(formData.trimester) as 1 | 2 | 3,
        comments: formData.comments,
      }
      setAssessments([...assessments, newAssessment])
    }

    setIsDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta avaliação?")) {
      setAssessments(assessments.filter((a) => a.id !== id))
    }
  }

  const getStudentName = (studentId: string) => {
    const student = mockStudents.find((s) => s.id === studentId)
    return student?.name || "N/A"
  }

  const getSubjectNameFromDiscipline = (disciplineId: string) => {
    const discipline = mockDisciplines.find((d) => d.id === disciplineId)
    const subject = mockSubjects.find((s) => s.id === discipline?.subjectId)
    return subject?.name || "N/A"
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
    if (teacherAssessments.length === 0) return { average: 0, total: 0, students: 0 }

    const total = teacherAssessments.length
    const average = teacherAssessments.reduce((sum, a) => sum + (a.grade / a.maxGrade) * 20, 0) / total
    const uniqueStudents = new Set(teacherAssessments.map((a) => a.studentId)).size

    return { average: average.toFixed(1), total, students: uniqueStudents }
  }

  const stats = calculateStats()

  return (
    <ProtectedRoute allowedRoles={["teacher"]}>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Lançamento de Notas</h1>
            <p className="text-muted-foreground mt-1">Gerencie as avaliações das suas disciplinas</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Alunos Avaliados</CardTitle>
                <BookOpen className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.students}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total de Avaliações</CardTitle>
                <BookOpen className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Média Geral</CardTitle>
                <BookOpen className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.average}</div>
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar avaliações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Avaliação
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle>{editingAssessment ? "Editar Avaliação" : "Nova Avaliação"}</DialogTitle>
                    <DialogDescription>Preencha os dados da avaliação</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="disciplineId">Disciplina</Label>
                      <Select
                        value={formData.disciplineId}
                        onValueChange={(value) => setFormData({ ...formData, disciplineId: value, studentId: "" })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a disciplina" />
                        </SelectTrigger>
                        <SelectContent>
                          {teacherDisciplines
                            .filter((d) => d.status === "active")
                            .map((discipline) => (
                              <SelectItem key={discipline.id} value={discipline.id}>
                                {getSubjectNameFromDiscipline(discipline.id)} -{" "}
                                {mockClassrooms.find((c) => c.id === discipline.classroomId)?.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="studentId">Aluno</Label>
                      <Select
                        value={formData.studentId}
                        onValueChange={(value) => setFormData({ ...formData, studentId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o aluno" />
                        </SelectTrigger>
                        <SelectContent>
                          {formData.disciplineId &&
                            mockStudents
                              .filter((s) => {
                                const discipline = mockDisciplines.find((d) => d.id === formData.disciplineId)
                                return s.classroomId === discipline?.classroomId && s.status === "active"
                              })
                              .map((student) => (
                                <SelectItem key={student.id} value={student.id}>
                                  {student.name}
                                </SelectItem>
                              ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Tipo de Avaliação</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value: "prova" | "trabalho" | "participacao") =>
                          setFormData({ ...formData, type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="prova">Prova</SelectItem>
                          <SelectItem value="trabalho">Trabalho</SelectItem>
                          <SelectItem value="participacao">Participação</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="grade">Nota Obtida</Label>
                        <Input
                          id="grade"
                          type="number"
                          step="0.1"
                          min="0"
                          max={formData.maxGrade}
                          value={formData.grade}
                          onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maxGrade">Nota Máxima</Label>
                        <Input
                          id="maxGrade"
                          type="number"
                          step="0.1"
                          min="0"
                          value={formData.maxGrade}
                          onChange={(e) => setFormData({ ...formData, maxGrade: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">Data</Label>
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="trimester">Trimestre</Label>
                        <Select
                          value={formData.trimester}
                          onValueChange={(value: "1" | "2" | "3") => setFormData({ ...formData, trimester: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1º Trimestre</SelectItem>
                            <SelectItem value="2">2º Trimestre</SelectItem>
                            <SelectItem value="3">3º Trimestre</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="comments">Observações (opcional)</Label>
                      <Textarea
                        id="comments"
                        value={formData.comments}
                        onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                        placeholder="Comentários sobre o desempenho do aluno..."
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">{editingAssessment ? "Salvar Alterações" : "Adicionar Avaliação"}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Disciplina</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Nota</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Trimestre</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssessments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      Nenhuma avaliação encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAssessments.map((assessment) => (
                    <TableRow key={assessment.id}>
                      <TableCell className="font-medium">{getStudentName(assessment.studentId)}</TableCell>
                      <TableCell>{getSubjectNameFromDiscipline(assessment.disciplineId)}</TableCell>
                      <TableCell>{getTypeLabel(assessment.type)}</TableCell>
                      <TableCell>
                        <span className="font-medium">
                          {assessment.grade}/{assessment.maxGrade}
                        </span>
                        <span className="text-muted-foreground text-sm ml-2">
                          ({((assessment.grade / assessment.maxGrade) * 20).toFixed(1)})
                        </span>
                      </TableCell>
                      <TableCell>{new Date(assessment.date).toLocaleDateString("pt-AO")}</TableCell>
                      <TableCell>{assessment.trimester}º Trim.</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(assessment)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(assessment.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
