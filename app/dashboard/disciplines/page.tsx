"use client"

import type React from "react"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
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
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { mockDisciplines, mockClassrooms, mockSubjects, mockTeachers } from "@/lib/mock-data"
import type { Discipline } from "@/lib/types"

export default function DisciplinesPage() {
  const [disciplines, setDisciplines] = useState<Discipline[]>(mockDisciplines)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDiscipline, setEditingDiscipline] = useState<Discipline | null>(null)
  const [formData, setFormData] = useState({
    classroomId: "",
    subjectId: "",
    teacherId: "",
    status: "active" as "active" | "inactive",
  })

  const handleOpenDialog = (discipline?: Discipline) => {
    if (discipline) {
      setEditingDiscipline(discipline)
      setFormData({
        classroomId: discipline.classroomId,
        subjectId: discipline.subjectId,
        teacherId: discipline.teacherId,
        status: discipline.status,
      })
    } else {
      setEditingDiscipline(null)
      setFormData({
        classroomId: "",
        subjectId: "",
        teacherId: "",
        status: "active",
      })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingDiscipline) {
      setDisciplines(disciplines.map((d) => (d.id === editingDiscipline.id ? { ...d, ...formData } : d)))
    } else {
      const newDiscipline: Discipline = {
        id: `disc${disciplines.length + 1}`,
        ...formData,
      }
      setDisciplines([...disciplines, newDiscipline])
    }

    setIsDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta disciplina?")) {
      setDisciplines(disciplines.filter((d) => d.id !== id))
    }
  }

  const getClassroomName = (classroomId: string) => {
    const classroom = mockClassrooms.find((c) => c.id === classroomId)
    return classroom?.name || "N/A"
  }

  const getSubjectName = (subjectId: string) => {
    const subject = mockSubjects.find((s) => s.id === subjectId)
    return subject?.name || "N/A"
  }

  const getTeacherName = (teacherId: string) => {
    const teacher = mockTeachers.find((t) => t.id === teacherId)
    return teacher?.name || "N/A"
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Disciplinas por Turma</h1>
              <p className="text-muted-foreground mt-1">Gerencie as disciplinas de cada turma e seus professores</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Disciplina
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle>{editingDiscipline ? "Editar Disciplina" : "Nova Disciplina"}</DialogTitle>
                    <DialogDescription>Associe uma disciplina a uma turma e atribua um professor</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="classroomId">Turma</Label>
                      <Select
                        value={formData.classroomId}
                        onValueChange={(value) => setFormData({ ...formData, classroomId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a turma" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockClassrooms
                            .filter((c) => c.status === "active")
                            .map((classroom) => (
                              <SelectItem key={classroom.id} value={classroom.id}>
                                {classroom.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subjectId">Disciplina</Label>
                      <Select
                        value={formData.subjectId}
                        onValueChange={(value) => setFormData({ ...formData, subjectId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a disciplina" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockSubjects.map((subject) => (
                            <SelectItem key={subject.id} value={subject.id}>
                              {subject.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="teacherId">Professor</Label>
                      <Select
                        value={formData.teacherId}
                        onValueChange={(value) => setFormData({ ...formData, teacherId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o professor" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockTeachers
                            .filter((t) => t.status === "active")
                            .map((teacher) => (
                              <SelectItem key={teacher.id} value={teacher.id}>
                                {teacher.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value: "active" | "inactive") => setFormData({ ...formData, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Ativo</SelectItem>
                          <SelectItem value="inactive">Inativo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">{editingDiscipline ? "Salvar Alterações" : "Adicionar Disciplina"}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Turma</TableHead>
                  <TableHead>Disciplina</TableHead>
                  <TableHead>Professor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {disciplines.map((discipline) => (
                  <TableRow key={discipline.id}>
                    <TableCell className="font-medium">{getClassroomName(discipline.classroomId)}</TableCell>
                    <TableCell>{getSubjectName(discipline.subjectId)}</TableCell>
                    <TableCell>{getTeacherName(discipline.teacherId)}</TableCell>
                    <TableCell>
                      <Badge variant={discipline.status === "active" ? "default" : "secondary"}>
                        {discipline.status === "active" ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(discipline)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(discipline.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
