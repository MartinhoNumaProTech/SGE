"use client"

import { useDataStore } from "@/lib/data-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, GraduationCap, BookOpen, ClipboardList } from "lucide-react"

export default function DashboardPage() {
  const { subjects, classes, students, assessments } = useDataStore()

  const stats = [
    {
      title: "Total de Alunos",
      value: students.length,
      icon: GraduationCap,
      description: "Alunos matriculados",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Turmas Ativas",
      value: classes.length,
      icon: Users,
      description: "Turmas atuais",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Disciplinas",
      value: subjects.length,
      icon: BookOpen,
      description: "Disciplinas disponíveis",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Avaliações",
      value: assessments.length,
      icon: ClipboardList,
      description: "Total de avaliações",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Painel</h1>
        <p className="mt-2 text-muted-foreground">Bem-vindo ao EscolaHub - O seu sistema completo de gestão escolar</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className={cn("rounded-lg p-2", stat.bgColor)}>
                  <Icon className={cn("h-5 w-5", stat.color)} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Novo aluno matriculado</p>
                  <p className="text-xs text-muted-foreground">Ana Silva entrou no 5º Ano A</p>
                </div>
                <span className="text-xs text-muted-foreground">há 2h</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50">
                  <ClipboardList className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Avaliação criada</p>
                  <p className="text-xs text-muted-foreground">Teste de Matemática 1 para 5º Ano A</p>
                </div>
                <span className="text-xs text-muted-foreground">há 5h</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-50">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Disciplina atualizada</p>
                  <p className="text-xs text-muted-foreground">Currículo de Matemática revisto</p>
                </div>
                <span className="text-xs text-muted-foreground">há 1d</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <button className="flex items-center gap-3 rounded-lg border border-border bg-background p-4 text-left transition-colors hover:bg-accent">
                <GraduationCap className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Adicionar Novo Aluno</p>
                  <p className="text-xs text-muted-foreground">Registar um novo aluno</p>
                </div>
              </button>
              <button className="flex items-center gap-3 rounded-lg border border-border bg-background p-4 text-left transition-colors hover:bg-accent">
                <ClipboardList className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Criar Avaliação</p>
                  <p className="text-xs text-muted-foreground">Adicionar um novo teste ou exame</p>
                </div>
              </button>
              <button className="flex items-center gap-3 rounded-lg border border-border bg-background p-4 text-left transition-colors hover:bg-accent">
                <BookOpen className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Registar Notas</p>
                  <p className="text-xs text-muted-foreground">Introduzir notas dos alunos</p>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
