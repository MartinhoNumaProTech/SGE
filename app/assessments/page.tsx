"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { useDataStore } from "@/lib/data-store"
import type { Assessment, Trimester } from "@/lib/types"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, ClipboardList, Calendar } from "lucide-react"

export default function AssessmentsPage() {
  const { assessments, subjects, classes, addAssessment, updateAssessment, deleteAssessment } = useDataStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(null)
  const [selectedTrimester, setSelectedTrimester] = useState<Trimester>("1")
  const [formData, setFormData] = useState({
    name: "",
    subjectId: "",
    classId: "",
    trimester: "1" as Trimester,
    type: "test" as Assessment["type"],
    maxScore: 100,
    weight: 1,
    date: new Date().toISOString().split("T")[0],
  })

  const filteredAssessments = useMemo(() => {
    return assessments.filter((a) => a.trimester === selectedTrimester)
  }, [assessments, selectedTrimester])

  const handleOpenDialog = (assessment?: Assessment) => {
    if (assessment) {
      setEditingAssessment(assessment)
      setFormData({
        name: assessment.name,
        subjectId: assessment.subjectId,
        classId: assessment.classId,
        trimester: assessment.trimester,
        type: assessment.type,
        maxScore: assessment.maxScore,
        weight: assessment.weight,
        date: new Date(assessment.date).toISOString().split("T")[0],
      })
    } else {
      setEditingAssessment(null)
      setFormData({
        name: "",
        subjectId: "",
        classId: "",
        trimester: selectedTrimester,
        type: "test",
        maxScore: 100,
        weight: 1,
        date: new Date().toISOString().split("T")[0],
      })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingAssessment) {
      updateAssessment(editingAssessment.id, {
        ...formData,
        date: new Date(formData.date),
      })
    } else {
      const newAssessment: Assessment = {
        id: Date.now().toString(),
        ...formData,
        date: new Date(formData.date),
        createdAt: new Date(),
      }
      addAssessment(newAssessment)
    }

    setIsDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem a certeza que deseja eliminar esta avaliação?")) {
      deleteAssessment(id)
    }
  }

  const getSubjectName = (id: string) => subjects.find((s) => s.id === id)?.name || "Desconhecida"
  const getClassName = (id: string) => classes.find((c) => c.id === id)?.name || "Desconhecida"

  const getTypeColor = (type: Assessment["type"]) => {
    const colors = {
      test: "bg-blue-100 text-blue-700",
      exam: "bg-red-100 text-red-700",
      assignment: "bg-green-100 text-green-700",
      project: "bg-purple-100 text-purple-700",
      quiz: "bg-orange-100 text-orange-700",
    }
    return colors[type]
  }

  const getTypeLabel = (type: Assessment["type"]) => {
    const labels = {
      test: "Teste",
      exam: "Exame",
      assignment: "Trabalho",
      project: "Projeto",
      quiz: "Questionário",
    }
    return labels[type]
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Avaliações</h1>
          <p className="mt-2 text-muted-foreground">Gerir testes, exames e trabalhos</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Avaliação
        </Button>
      </div>

      <Tabs value={selectedTrimester} onValueChange={(v) => setSelectedTrimester(v as Trimester)}>
        <TabsList>
          <TabsTrigger value="1">1º Período</TabsTrigger>
          <TabsTrigger value="2">2º Período</TabsTrigger>
          <TabsTrigger value="3">3º Período</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTrimester} className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAssessments.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <ClipboardList className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">Nenhuma avaliação para este período</p>
                </CardContent>
              </Card>
            ) : (
              filteredAssessments.map((assessment) => (
                <Card key={assessment.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{assessment.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {getSubjectName(assessment.subjectId)} • {getClassName(assessment.classId)}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge className={getTypeColor(assessment.type)}>{getTypeLabel(assessment.type)}</Badge>
                        <span className="text-sm text-muted-foreground">Peso: {assessment.weight}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(assessment.date).toLocaleDateString("pt-PT")}
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Nota Máxima: </span>
                        <span className="font-semibold text-foreground">{assessment.maxScore}</span>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDialog(assessment)}
                          className="flex-1"
                        >
                          <Pencil className="mr-2 h-3 w-3" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(assessment.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editingAssessment ? "Editar Avaliação" : "Adicionar Nova Avaliação"}</DialogTitle>
              <DialogDescription>
                {editingAssessment
                  ? "Atualize as informações da avaliação abaixo."
                  : "Introduza os detalhes da nova avaliação."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Avaliação</Label>
                <Input
                  id="name"
                  placeholder="ex: Teste de Matemática 1"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Disciplina</Label>
                  <Select
                    value={formData.subjectId}
                    onValueChange={(value) => setFormData({ ...formData, subjectId: value })}
                  >
                    <SelectTrigger id="subject">
                      <SelectValue placeholder="Selecione a disciplina" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="class">Turma</Label>
                  <Select
                    value={formData.classId}
                    onValueChange={(value) => setFormData({ ...formData, classId: value })}
                  >
                    <SelectTrigger id="class">
                      <SelectValue placeholder="Selecione a turma" />
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
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="trimester">Período</Label>
                  <Select
                    value={formData.trimester}
                    onValueChange={(value) => setFormData({ ...formData, trimester: value as Trimester })}
                  >
                    <SelectTrigger id="trimester">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1º Período</SelectItem>
                      <SelectItem value="2">2º Período</SelectItem>
                      <SelectItem value="3">3º Período</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value as Assessment["type"] })}
                  >
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="test">Teste</SelectItem>
                      <SelectItem value="exam">Exame</SelectItem>
                      <SelectItem value="assignment">Trabalho</SelectItem>
                      <SelectItem value="project">Projeto</SelectItem>
                      <SelectItem value="quiz">Questionário</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxScore">Nota Máxima</Label>
                  <Input
                    id="maxScore"
                    type="number"
                    value={formData.maxScore}
                    onChange={(e) => setFormData({ ...formData, maxScore: Number.parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Peso</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: Number.parseFloat(e.target.value) })}
                    required
                  />
                </div>
              </div>
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
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">{editingAssessment ? "Atualizar" : "Criar"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
