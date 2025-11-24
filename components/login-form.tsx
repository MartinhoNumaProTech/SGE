"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { GraduationCap } from "lucide-react"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const success = login(email, password)
    if (success) {
      router.push("/dashboard")
    } else {
      setError("Email ou senha inválidos")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl">Sistema de Gestão Escolar</CardTitle>
            <CardDescription>Entre com suas credenciais para acessar</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.ao"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </form>

          <div className="mt-6 p-4 bg-muted rounded-lg space-y-2 text-sm">
            <p className="font-medium">Credenciais de teste:</p>
            <div className="space-y-1 text-muted-foreground">
              <p>Admin: admin@escola.ao</p>
              <p>Professor: joao@escola.ao</p>
              <p>Encarregado: maria@email.ao</p>
              <p className="text-xs mt-2">Senha: qualquer</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
