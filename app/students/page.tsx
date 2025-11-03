"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { useDataStore } from "@/lib/data-store"
import type { Student } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash2, Search, GraduationCap } from "lucide-react"

export default function StudentsPage() {
  const { students, classes, addStudent, updateStudent, deleteStudent } = useDataStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterClass, setFilterClass] = useState<string>("all")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    classId: "",
    parentEmail: "",
    parentPhone: "",
  })

  //filtro de alunos

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesClass = filterClass === "all" || student.classId === filterClass
      return matchesSearch && matchesClass
    })
  }, [students, searchTerm, filterClass])

  const handleOpenDialog = (student?: Student) => {
    if (student) {
      setEditingStudent(student)
      setFormData({
        name: student.name,
        email: student.email,
        classId: student.classId,
        parentEmail: student.parentEmail || "",
        parentPhone: student.parentPhone || "",
      })
    } else {
      setEditingStudent(null)
      setFormData({
        name: "",
        email: "",
        classId: "",
        parentEmail: "",
        parentPhone: "",
      })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingStudent) {
      updateStudent(editingStudent.id, formData)
    } else {
      const newStudent: Student = {
        id: Date.now().toString(),
        ...formData,
        enrollmentDate: new Date(),
      }
      addStudent(newStudent)
    }

    setIsDialogOpen(false)
    setFormData({ name: "", email: "", classId: "", parentEmail: "", parentPhone: "" })
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem a certeza que deseja eliminar este aluno?")) {
      deleteStudent(id)
    }
  }

  const getClassName = (classId: string) => {
    return classes.find((c) => c.id === classId)?.name || "Desconhecida"
  }

  //adicionar aluno

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Alunos</h1>
          <p className="mt-2 text-muted-foreground">Gerir todos os alunos da escola</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Aluno
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Alunos</CardTitle>
          <div className="flex gap-4 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterClass} onValueChange={setFilterClass}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrar por turma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Turmas</SelectItem>
                {classes.map((classItem) => (
                  <SelectItem key={classItem.id} value={classItem.id}>
                    {classItem.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Turma</TableHead>
                <TableHead>Email do Encarregado</TableHead>
                <TableHead>Telefone do Encarregado</TableHead>
                <TableHead>Data de Matrícula</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    Nenhum aluno encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50">
                          <GraduationCap className="h-4 w-4 text-blue-600" />
                        </div>
                        {student.name}
                      </div>
                    </TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{getClassName(student.classId)}</TableCell>
                    <TableCell>{student.parentEmail || "-"}</TableCell>
                    <TableCell>{student.parentPhone || "-"}</TableCell>
                    <TableCell>{new Date(student.enrollmentDate).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(student)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(student.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editingStudent ? "Editar Aluno" : "Adicionar Novo Aluno"}</DialogTitle>
              <DialogDescription>
                {editingStudent ? "Atualize as informações do aluno abaixo." : "Introduza os detalhes do novo aluno."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Aluno</Label>
                <Input
                  id="name"
                  placeholder="ex: Ana Silva"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email do Aluno</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="aluno@escola.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="class">Turma</Label>
                <Select
                  value={formData.classId}
                  onValueChange={(value) => setFormData({ ...formData, classId: value })}
                >
                  <SelectTrigger id="class">
                    <SelectValue placeholder="Selecione uma turma" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((classItem) => (
                      <SelectItem key={classItem.id} value={classItem.id}>
                        {classItem.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="parentEmail">Email do Encarregado</Label>
                <Input
                  id="parentEmail"
                  type="email"
                  placeholder="encarregado@email.com"
                  value={formData.parentEmail}
                  onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parentPhone">Telefone do Encarregado</Label>
                <Input
                  id="parentPhone"
                  type="tel"
                  placeholder="+244 972 ### ###"
                  value={formData.parentPhone}
                  onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">{editingStudent ? "Atualizar" : "Criar"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
