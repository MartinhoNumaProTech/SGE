import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Sistema de Gestão Escolar
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Gerencie alunos, professores e turmas de forma eficiente
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Alunos</h3>
            <p className="text-gray-600">Acompanhe o desempenho e presença dos estudantes</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Professores</h3>
            <p className="text-gray-600">Gerencie horários e avaliações dos docentes</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Turmas</h3>
            <p className="text-gray-600">Organize classes e distribua alunos</p>
          </div>
        </div>

        <div className="space-y-4">
          <Link href="/login">
            <Button size="lg" className="px-8 py-3 text-lg">
              Entrar no Sistema
            </Button>
          </Link>
          <p className="text-sm text-gray-500">
            Acesso restrito a administradores, professores e alunos
          </p>
        </div>
      </div>
    </div>
  )
}
