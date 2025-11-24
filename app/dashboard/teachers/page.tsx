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
import { mockTeachers } from "@/lib/mock-data"
import type { Teacher } from "@/lib/types"

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    hireDate: "",
    status: "active" as "active" | "inactive",
  })

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleOpenDialog = (teacher?: Teacher) => {
    if (teacher) {
      setEditingTeacher(teacher)
      setFormData({
        name: teacher.name,
        email: teacher.email,
        phone: teacher.phone,
        hireDate: teacher.hireDate,
        status: teacher.status,
      })
    } else {
      setEditingTeacher(null)
      setFormData({
        name: "",
        email: "",
        phone: "",
        hireDate: "",
        status: "active",
      })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingTeacher) {
      setTeachers(teachers.map((t) => (t.id === editingTeacher.id ? { ...t, ...formData } : t)))
    } else {
      const newTeacher: Teacher = {
        id: `t${teachers.length + 1}`,
        ...formData,
      }
      setTeachers([...teachers, newTeacher])
    }

    setIsDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este professor?")) {
      setTeachers(teachers.filter((t) => t.id !== id))
    }
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Professores</h1>
              <p className="text-muted-foreground mt-1">
                Gerencie o corpo docente. As disciplinas são atribuídas na seção de Disciplinas por Turma.
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Professor
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle>{editingTeacher ? "Editar Professor" : "Novo Professor"}</DialogTitle>
                    <DialogDescription>Preencha os dados do professor</DialogDescription>
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
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+244 923 456 789"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hireDate">Data de Contratação</Label>
                      <Input
                        id="hireDate"
                        type="date"
                        value={formData.hireDate}
                        onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
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
                    <Button type="submit">{editingTeacher ? "Salvar Alterações" : "Adicionar Professor"}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar professores..."
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
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell className="font-medium">{teacher.name}</TableCell>
                    <TableCell>{teacher.email}</TableCell>
                    <TableCell>{teacher.phone}</TableCell>
                    <TableCell>
                      <Badge variant={teacher.status === "active" ? "default" : "secondary"}>
                        {teacher.status === "active" ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(teacher)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(teacher.id)}>
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
