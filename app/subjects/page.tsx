"use client"

import type React from "react"

import { useState } from "react"
import { useDataStore } from "@/lib/data-store"
import type { Subject } from "@/lib/types"
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Pencil, Trash2, BookOpen } from "lucide-react"

export default function SubjectsPage() {
  const { subjects, classes, addSubject, updateSubject, deleteSubject } = useDataStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    classId: "", // Added classId to form
  })

  const handleOpenDialog = (subject?: Subject) => {
    if (subject) {
      setEditingSubject(subject)
      setFormData({
        name: subject.name,
        code: subject.code,
        description: subject.description || "",
        classId: subject.classId, // Include classId
      })
    } else {
      setEditingSubject(null)
      setFormData({ name: "", code: "", description: "", classId: "" })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingSubject) {
      updateSubject(editingSubject.id, formData)
    } else {
      const newSubject: Subject = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date(),
      }
      addSubject(newSubject)
    }

    setIsDialogOpen(false)
    setFormData({ name: "", code: "", description: "", classId: "" })
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem a certeza que deseja eliminar esta disciplina?")) {
      deleteSubject(id)
    }
  }

  const getClassName = (classId: string) => {
    return classes.find((c) => c.id === classId)?.name || "Desconhecida"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Disciplinas</h1>
          <p className="mt-2 text-muted-foreground">Gerir todas as disciplinas da escola</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Disciplina
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => (
          <Card key={subject.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{subject.name}</CardTitle>
                    <CardDescription>{subject.code}</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-2 text-sm text-muted-foreground">{subject.description || "Sem descrição"}</p>
              <p className="mb-4 text-sm font-medium text-foreground">Turma e Ano: {getClassName(subject.classId)}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleOpenDialog(subject)} className="flex-1">
                  <Pencil className="mr-2 h-3 w-3" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(subject.id)}
                  className="text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editingSubject ? "Editar Disciplina" : "Adicionar Nova Disciplina"}</DialogTitle>
              <DialogDescription>
                {editingSubject
                  ? "Atualize as informações da disciplina abaixo."
                  : "Introduza os detalhes da nova disciplina."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Disciplina</Label>
                <Input
                  id="name"
                  placeholder="ex: Matemática"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Código da Disciplina</Label>
                <Input
                  id="code"
                  placeholder="ex: MAT101"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
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
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Breve descrição da disciplina"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">{editingSubject ? "Atualizar" : "Criar"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
