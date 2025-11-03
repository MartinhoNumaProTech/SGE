"use client"

import { useState, useMemo } from "react"
import { useDataStore } from "@/lib/data-store"
import type { Grade } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { FileText, Save, CheckCircle2 } from "lucide-react"

export default function GradesPage() {
  const { assessments, students, subjects, classes, grades, addGrade, updateGrade } = useDataStore()
  const [selectedAssessment, setSelectedAssessment] = useState<string>("")
  const [gradeInputs, setGradeInputs] = useState<Record<string, number>>({})
  const [savedGrades, setSavedGrades] = useState<Set<string>>(new Set())

  const selectedAssessmentData = useMemo(() => {
    return assessments.find((a) => a.id === selectedAssessment)
  }, [assessments, selectedAssessment])

  const studentsInClass = useMemo(() => {
    if (!selectedAssessmentData) return []
    return students.filter((s) => s.classId === selectedAssessmentData.classId)
  }, [students, selectedAssessmentData])

  const existingGrades = useMemo(() => {
    return grades.filter((g) => g.assessmentId === selectedAssessment)
  }, [grades, selectedAssessment])

  const handleGradeChange = (studentId: string, value: string) => {
    const numValue = Number.parseFloat(value)
    setGradeInputs((prev) => ({
      ...prev,
      [studentId]: numValue,
    }))
    setSavedGrades((prev) => {
      const newSet = new Set(prev)
      newSet.delete(studentId)
      return newSet
    })
  }

  const handleSaveGrade = (studentId: string) => {
    const score = gradeInputs[studentId]
    if (score === undefined || Number.isNaN(score)) return

    const existingGrade = existingGrades.find((g) => g.studentId === studentId)

    if (existingGrade) {
      updateGrade(existingGrade.id, { score, submittedAt: new Date() })
    } else {
      const newGrade: Grade = {
        id: Date.now().toString(),
        studentId,
        assessmentId: selectedAssessment,
        score,
        submittedAt: new Date(),
      }
      addGrade(newGrade)
    }

    setSavedGrades((prev) => new Set(prev).add(studentId))
  }

  const getGradeForStudent = (studentId: string) => {
    return existingGrades.find((g) => g.studentId === studentId)
  }

  const getSubjectName = (id: string) => subjects.find((s) => s.id === id)?.name || "Unknown"
  const getClassName = (id: string) => classes.find((c) => c.id === id)?.name || "Unknown"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Registo de Notas</h1>
        <p className="mt-2 text-muted-foreground">Registe e gira as notas dos alunos nas avaliações</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Selecionar Avaliação</CardTitle>
          <CardDescription>Escolha uma avaliação para registar notas</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedAssessment} onValueChange={setSelectedAssessment}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma avaliação" />
            </SelectTrigger>
            <SelectContent>
              {assessments.map((assessment) => (
                <SelectItem key={assessment.id} value={assessment.id}>
                  {assessment.name} - {getSubjectName(assessment.subjectId)} ({getClassName(assessment.classId)}) -
                  Trimestre {assessment.trimester}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedAssessmentData && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Detalhes da Avaliação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <p className="text-sm text-muted-foreground">Disciplina</p>
                  <p className="font-medium">{getSubjectName(selectedAssessmentData.subjectId)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Turma e Ano</p>
                  <p className="font-medium">{getClassName(selectedAssessmentData.classId)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nota Máxima</p>
                  <p className="font-medium">{selectedAssessmentData.maxScore}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tipo</p>
                  <Badge>{selectedAssessmentData.type}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notas dos Alunos</CardTitle>
              <CardDescription>
                Insira notas para {studentsInClass.length} alunos (Máx: {selectedAssessmentData.maxScore})
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome do Aluno</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Nota</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentsInClass.map((student) => {
                    const existingGrade = getGradeForStudent(student.id)
                    const currentValue = gradeInputs[student.id] ?? existingGrade?.score ?? ""
                    const isSaved = savedGrades.has(student.id)

                    return (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            max={selectedAssessmentData.maxScore}
                            step="0.5"
                            value={currentValue}
                            onChange={(e) => handleGradeChange(student.id, e.target.value)}
                            className="w-24"
                            placeholder="0"
                          />
                        </TableCell>
                        <TableCell>
                          {isSaved ? (
                            <Badge className="bg-green-100 text-green-700">
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              Guardado
                            </Badge>
                          ) : existingGrade ? (
                            <Badge variant="outline">Registado</Badge>
                          ) : (
                            <Badge variant="secondary">Pendente</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" onClick={() => handleSaveGrade(student.id)} disabled={isSaved}>
                            <Save className="mr-2 h-3 w-3" />
                            Guardar
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}

      {!selectedAssessmentData && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">Selecione uma avaliação para começar a registar notas</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
