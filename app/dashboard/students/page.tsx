"use client"

import type React from "react"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Plus, Pencil, Trash2, Search } from "lucide-react"
import { mockStudents, mockGuardians, mockClassrooms } from "@/lib/mock-data"
import type { Student } from "@/lib/types"
import { useAuth } from "@/contexts/auth-context"

export default function StudentsPage() {
  const { user } = useAuth()
  const [students, setStudents] = useState<Student[]>(mockStudents)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    dateOfBirth: "",
    enrollmentDate: "",
    guardianId: "",
    classroomId: "",
    status: "active" as "active" | "inactive",
  })

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mockClassrooms
        .find((c) => c.id === student.classroomId)
        ?.name.toLowerCase()
        .includes(searchTerm.toLowerCase()),
  )

  const handleOpenDialog = (student?: Student) => {
    if (student) {
      setEditingStudent(student)
      setFormData({
        name: student.name,
        dateOfBirth: student.dateOfBirth,
        enrollmentDate: student.enrollmentDate,
        guardianId: student.guardianId,
        classroomId: student.classroomId,
        status: student.status,
      })
    } else {
      setEditingStudent(null)
      setFormData({
        name: "",
        dateOfBirth: "",
        enrollmentDate: "",
        guardianId: "",
        classroomId: "",
        status: "active",
      })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingStudent) {
      setStudents(students.map((s) => (s.id === editingStudent.id ? { ...s, ...formData } : s)))
    } else {
      const newStudent: Student = {
        id: `s${students.length + 1}`,
        ...formData,
      }
      setStudents([...students, newStudent])
    }

    setIsDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este aluno?")) {
      setStudents(students.filter((s) => s.id !== id))
    }
  }

  const getGuardianName = (guardianId: string) => {
    const guardian = mockGuardians.find((g) => g.id === guardianId)
    return guardian?.name || "N/A"
  }

  const getClassroomName = (classroomId: string) => {
    const classroom = mockClassrooms.find((c) => c.id === classroomId)
    return classroom?.name || "N/A"
  }

  return (
    <ProtectedRoute allowedRoles={["admin", "teacher"]}>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Alunos</h1>
              <p className="text-muted-foreground mt-1">Gerencie os alunos da escola</p>
            </div>
            {user?.role === "admin" && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => handleOpenDialog()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Aluno
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <form onSubmit={handleSubmit}>
                    <DialogHeader>
                      <DialogTitle>{editingStudent ? "Editar Aluno" : "Novo Aluno"}</DialogTitle>
                      <DialogDescription>Preencha os dados do aluno</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Data de Nascimento</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                          required
                        />
                      </div>
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
                        <Label htmlFor="guardianId">Encarregado</Label>
                        <Select
                          value={formData.guardianId}
                          onValueChange={(value) => setFormData({ ...formData, guardianId: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o encarregado" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockGuardians.map((guardian) => (
                              <SelectItem key={guardian.id} value={guardian.id}>
                                {guardian.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="enrollmentDate">Data de Matrícula</Label>
                        <Input
                          id="enrollmentDate"
                          type="date"
                          value={formData.enrollmentDate}
                          onChange={(e) => setFormData({ ...formData, enrollmentDate: e.target.value })}
                          required
                        />
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
                      <Button type="submit">{editingStudent ? "Salvar Alterações" : "Adicionar Aluno"}</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar alunos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Turma</TableHead>
                  <TableHead>Encarregado</TableHead>
                  <TableHead>Data de Nascimento</TableHead>
                  <TableHead>Status</TableHead>
                  {user?.role === "admin" && <TableHead className="text-right">Ações</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{getClassroomName(student.classroomId)}</TableCell>
                    <TableCell>{getGuardianName(student.guardianId)}</TableCell>
                    <TableCell>{new Date(student.dateOfBirth).toLocaleDateString("pt-AO")}</TableCell>
                    <TableCell>
                      <Badge variant={student.status === "active" ? "default" : "secondary"}>
                        {student.status === "active" ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    {user?.role === "admin" && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(student)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(student.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
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
