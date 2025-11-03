"use client"

import type React from "react"

import { useState } from "react"
import { useDataStore } from "@/lib/data-store"
import type { Class } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Plus, Pencil, Trash2, Users, BookOpen } from "lucide-react"

export default function ClassesPage() {
  const { classes, subjects, students, addClass, updateClass, deleteClass } = useDataStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingClass, setEditingClass] = useState<Class | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    grade: "",
    year: new Date().getFullYear(),
  })

  const handleOpenDialog = (classData?: Class) => {
    if (classData) {
      setEditingClass(classData)
      setFormData({
        name: classData.name,
        grade: classData.grade,
        year: classData.year,
      })
    } else {
      setEditingClass(null)
      setFormData({
        name: "",
        grade: "",
        year: new Date().getFullYear(),
      })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingClass) {
      updateClass(editingClass.id, formData)
    } else {
      const newClass: Class = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date(),
      }
      addClass(newClass)
    }

    setIsDialogOpen(false)
    setFormData({ name: "", grade: "", year: new Date().getFullYear() })
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem a certeza que deseja eliminar esta turma?")) {
      deleteClass(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Turmas</h1>
          <p className="mt-2 text-muted-foreground">Gerir todas as turmas da escola</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Turma
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {classes.map((classItem) => {
          const classStudents = students.filter((s) => s.classId === classItem.id)
          const classSubjects = subjects.filter((s) => s.classId === classItem.id)

          return (
            <Card key={classItem.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{classItem.name}</CardTitle>
                      <CardDescription>
                        Ano {classItem.grade} • {classItem.year}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{classStudents.length} alunos</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{classSubjects.length} disciplinas</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleOpenDialog(classItem)} className="flex-1">
                    <Pencil className="mr-2 h-3 w-3" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(classItem.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editingClass ? "Editar Turma" : "Adicionar Nova Turma"}</DialogTitle>
              <DialogDescription>
                {editingClass ? "Atualize as informações da turma abaixo." : "Introduza os detalhes da nova turma."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Turma</Label>
                <Input
                  id="name"
                  placeholder="ex: 5º Ano A"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="grade">Ano</Label>
                  <Input
                    id="grade"
                    placeholder="ex: 5"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Ano Letivo</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: Number.parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">{editingClass ? "Atualizar" : "Criar"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
