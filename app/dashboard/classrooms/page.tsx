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
import { mockClassrooms, mockSchoolClasses } from "@/lib/mock-data"
import type { Classroom } from "@/lib/types"

export default function ClassroomsPage() {
  const [classrooms, setClassrooms] = useState<Classroom[]>(mockClassrooms)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingClassroom, setEditingClassroom] = useState<Classroom | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    classId: "",
    year: new Date().getFullYear(),
    status: "active" as "active" | "inactive",
  })

  const filteredClassrooms = classrooms.filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleOpenDialog = (classroom?: Classroom) => {
    if (classroom) {
      setEditingClassroom(classroom)
      setFormData({
        name: classroom.name,
        classId: classroom.classId,
        year: classroom.year,
        status: classroom.status,
      })
    } else {
      setEditingClassroom(null)
      setFormData({
        name: "",
        classId: "",
        year: new Date().getFullYear(),
        status: "active",
      })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingClassroom) {
      setClassrooms(classrooms.map((c) => (c.id === editingClassroom.id ? { ...c, ...formData } : c)))
    } else {
      const newClassroom: Classroom = {
        id: `room${classrooms.length + 1}`,
        ...formData,
      }
      setClassrooms([...classrooms, newClassroom])
    }

    setIsDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta turma?")) {
      setClassrooms(classrooms.filter((c) => c.id !== id))
    }
  }

  const getClassName = (classId: string) => {
    const schoolClass = mockSchoolClasses.find((c) => c.id === classId)
    return schoolClass?.name || "N/A"
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Turmas</h1>
              <p className="text-muted-foreground mt-1">Gerencie as turmas das classes</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Turma
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle>{editingClassroom ? "Editar Turma" : "Nova Turma"}</DialogTitle>
                    <DialogDescription>Preencha os dados da turma</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome da Turma</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ex: 7ª Classe A"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="classId">Classe</Label>
                      <Select
                        value={formData.classId}
                        onValueChange={(value) => setFormData({ ...formData, classId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a classe" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockSchoolClasses
                            .filter((c) => c.status === "active")
                            .map((schoolClass) => (
                              <SelectItem key={schoolClass.id} value={schoolClass.id}>
                                {schoolClass.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
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
                    <Button type="submit">{editingClassroom ? "Salvar Alterações" : "Adicionar Turma"}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar turmas..."
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
                  <TableHead>Classe</TableHead>
                  <TableHead>Ano Letivo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClassrooms.map((classroom) => (
                  <TableRow key={classroom.id}>
                    <TableCell className="font-medium">{classroom.name}</TableCell>
                    <TableCell>{getClassName(classroom.classId)}</TableCell>
                    <TableCell>{classroom.year}</TableCell>
                    <TableCell>
                      <Badge variant={classroom.status === "active" ? "default" : "secondary"}>
                        {classroom.status === "active" ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(classroom)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(classroom.id)}>
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
