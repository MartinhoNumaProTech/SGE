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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Pencil, Trash2, Search, Copy, Eye, EyeOff } from "lucide-react"
import { mockGuardians, mockStudents } from "@/lib/mock-data"
import type { Guardian } from "@/lib/types"
import { generateUsername, generatePassword } from "@/lib/utils-credentials"

export default function GuardiansPage() {
  const [guardians, setGuardians] = useState<Guardian[]>(mockGuardians)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingGuardian, setEditingGuardian] = useState<Guardian | null>(null)
  const [showCredentials, setShowCredentials] = useState(false)
  const [generatedCredentials, setGeneratedCredentials] = useState<{ username: string; password: string } | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    relationship: "",
    processNumber: "",
  })

  const filteredGuardians = guardians.filter(
    (guardian) =>
      guardian.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guardian.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guardian.processNumber.includes(searchTerm),
  )

  const handleOpenDialog = (guardian?: Guardian) => {
    if (guardian) {
      setEditingGuardian(guardian)
      setFormData({
        name: guardian.name,
        email: guardian.email,
        phone: guardian.phone,
        relationship: guardian.relationship,
        processNumber: guardian.processNumber,
      })
      setGeneratedCredentials(null)
    } else {
      setEditingGuardian(null)
      setFormData({
        name: "",
        email: "",
        phone: "",
        relationship: "",
        processNumber: "",
      })
      setGeneratedCredentials(null)
    }
    setIsDialogOpen(true)
  }

  const handleCopyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingGuardian) {
      setGuardians(guardians.map((g) => (g.id === editingGuardian.id ? { ...g, ...formData } : g)))
      setIsDialogOpen(false)
    } else {
      const username = generateUsername(formData.processNumber)
      const password = generatePassword()

      const newGuardian: Guardian = {
        id: `g${guardians.length + 1}`,
        ...formData,
        studentIds: [],
        username,
        password,
      }
      setGuardians([...guardians, newGuardian])
      setGeneratedCredentials({ username, password })
    }
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este encarregado?")) {
      setGuardians(guardians.filter((g) => g.id !== id))
    }
  }

  const getStudentNames = (studentIds: string[]) => {
    return (
      studentIds
        .map((id) => mockStudents.find((s) => s.id === id)?.name)
        .filter(Boolean)
        .join(", ") || "Nenhum"
    )
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Encarregados de Educação</h1>
              <p className="text-muted-foreground mt-1">Gerencie os encarregados de educação</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Encarregado
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle>{editingGuardian ? "Editar Encarregado" : "Novo Encarregado"}</DialogTitle>
                    <DialogDescription>
                      {editingGuardian
                        ? "Edite os dados do encarregado"
                        : "Preencha os dados do encarregado. Insira o número de processo do aluno para gerar as credenciais."}
                    </DialogDescription>
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
                      <Label htmlFor="relationship">Parentesco</Label>
                      <Input
                        id="relationship"
                        value={formData.relationship}
                        onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                        placeholder="Ex: Mãe, Pai, Tutor"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="processNumber">Número de Processo do Aluno</Label>
                      <Input
                        id="processNumber"
                        value={formData.processNumber}
                        onChange={(e) => setFormData({ ...formData, processNumber: e.target.value })}
                        placeholder="Ex: 12345"
                        required
                        disabled={!!editingGuardian}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">
                      {editingGuardian ? "Salvar Alterações" : "Gerar Credenciais e Adicionar"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {generatedCredentials && !editingGuardian && (
            <AlertDialog defaultOpen>
              <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                  <AlertDialogTitle>Credenciais do Novo Encarregado</AlertDialogTitle>
                  <AlertDialogDescription>
                    As credenciais foram geradas automaticamente. O utilizador é baseado no número de processo e a senha
                    contém 5 dígitos aleatórios.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Utilizador</Label>
                    <div className="flex items-center gap-2">
                      <Input readOnly value={generatedCredentials.username} className="bg-muted" />
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleCopyToClipboard(generatedCredentials.username, "username")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    {copiedField === "username" && <p className="text-xs text-green-600">Copiado!</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Senha (5 dígitos)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        readOnly
                        type={showCredentials ? "text" : "password"}
                        value={generatedCredentials.password}
                        className="bg-muted"
                      />
                      <Button size="icon" variant="outline" onClick={() => setShowCredentials(!showCredentials)}>
                        {showCredentials ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleCopyToClipboard(generatedCredentials.password, "password")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    {copiedField === "password" && <p className="text-xs text-green-600">Copiado!</p>}
                  </div>
                </div>
                <AlertDialogAction onClick={() => setGeneratedCredentials(null)}>Fechar</AlertDialogAction>
              </AlertDialogContent>
            </AlertDialog>
          )}

          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar encarregados..."
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
                  <TableHead>Nº Processo</TableHead>
                  <TableHead>Utilizador</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Parentesco</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGuardians.map((guardian) => (
                  <TableRow key={guardian.id}>
                    <TableCell className="font-medium">{guardian.name}</TableCell>
                    <TableCell>{guardian.email}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{guardian.processNumber}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{guardian.username}</TableCell>
                    <TableCell>{guardian.phone}</TableCell>
                    <TableCell>{guardian.relationship}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(guardian)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(guardian.id)}>
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
