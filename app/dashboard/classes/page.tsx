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
import { mockSchoolClasses } from "@/lib/mock-data"
import type { SchoolClass } from "@/lib/types"

export default function ClassesPage() {
  const [classes, setClasses] = useState<SchoolClass[]>(mockSchoolClasses)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingClass, setEditingClass] = useState<SchoolClass | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    year: new Date().getFullYear(),
    status: "active" as "active" | "inactive",
  })

  const filteredClasses = classes.filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleOpenDialog = (schoolClass?: SchoolClass) => {
    if (schoolClass) {
      setEditingClass(schoolClass)
      setFormData({
        name: schoolClass.name,
        year: schoolClass.year,
        status: schoolClass.status,
      })
    } else {
      setEditingClass(null)
      setFormData({
        name: "",
        year: new Date().getFullYear(),
        status: "active",
      })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingClass) {
      setClasses(classes.map((c) => (c.id === editingClass.id ? { ...c, ...formData } : c)))
    } else {
      const newClass: SchoolClass = {
        id: `class${classes.length + 1}`,
        ...formData,
      }
      setClasses([...classes, newClass])
    }

    setIsDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta classe?")) {
      setClasses(classes.filter((c) => c.id !== id))
    }
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Classes</h1>
              <p className="text-muted-foreground mt-1">Gerencie as classes da escola</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Classe
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle>{editingClass ? "Editar Classe" : "Nova Classe"}</DialogTitle>
                    <DialogDescription>Preencha os dados da classe</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome da Classe</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ex: 7ª Classe"
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
                    <Button type="submit">{editingClass ? "Salvar Alterações" : "Adicionar Classe"}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar classes..."
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
                  <TableHead>Ano Letivo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClasses.map((schoolClass) => (
                  <TableRow key={schoolClass.id}>
                    <TableCell className="font-medium">{schoolClass.name}</TableCell>
                    <TableCell>{schoolClass.year}</TableCell>
                    <TableCell>
                      <Badge variant={schoolClass.status === "active" ? "default" : "secondary"}>
                        {schoolClass.status === "active" ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(schoolClass)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(schoolClass.id)}>
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
