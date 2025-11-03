"use client"

import { useState, useMemo } from "react"
import { useDataStore } from "@/lib/data-store"
import { calculateStudentAverage, getGradeLevel, calculateClassAverage } from "@/lib/analytics"
import type { Trimester } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calculator, TrendingDown } from "lucide-react"

export default function AveragesPage() {
  const { students, subjects, classes, assessments, grades } = useDataStore()
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const [selectedTrimester, setSelectedTrimester] = useState<Trimester>("1")

  const filteredSubjects = useMemo(() => {
    if (!selectedClass) return subjects
    return subjects.filter((s) => s.classId === selectedClass)
  }, [subjects, selectedClass])

  const studentsInClass = useMemo(() => {
    if (!selectedClass) return []
    return students.filter((s) => s.classId === selectedClass)
  }, [students, selectedClass])

  const classAverage = useMemo(() => {
    if (!selectedClass || !selectedSubject) return 0
    return calculateClassAverage(selectedClass, selectedSubject, selectedTrimester, students, assessments, grades)
  }, [selectedClass, selectedSubject, selectedTrimester, students, assessments, grades])

  const studentAverages = useMemo(() => {
    if (!selectedClass || !selectedSubject) return []

    return studentsInClass.map((student) => {
      const average = calculateStudentAverage(student.id, selectedSubject, selectedTrimester, assessments, grades)
      const gradeLevel = getGradeLevel(average)
      const isBelowAverage = average > 0 && average < classAverage

      return {
        student,
        average,
        gradeLevel,
        isBelowAverage,
      }
    })
  }, [studentsInClass, selectedSubject, selectedTrimester, assessments, grades, classAverage])

  const belowAverageCount = studentAverages.filter((sa) => sa.isBelowAverage).length
  const belowAveragePercentage =
    studentsInClass.length > 0 ? ((belowAverageCount / studentsInClass.length) * 100).toFixed(1) : "0"

  const getGradeLevelColor = (level: string) => {
    switch (level) {
      case "A":
        return "bg-green-100 text-green-700 border-green-300"
      case "B":
        return "bg-blue-100 text-blue-700 border-blue-300"
      case "C":
        return "bg-yellow-100 text-yellow-700 border-yellow-300"
      case "D":
        return "bg-orange-100 text-orange-700 border-orange-300"
      case "F":
        return "bg-red-100 text-red-700 border-red-300"
      default:
        return "bg-gray-100 text-gray-700 border-gray-300"
    }
  }

  const getClassName = (id: string) => classes.find((c) => c.id === id)?.name || "Desconhecida"
  const getSubjectName = (id: string) => subjects.find((s) => s.id === id)?.name || "Desconhecida"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Médias dos Alunos</h1>
        <p className="mt-2 text-muted-foreground">Visualize as médias finais calculadas por trimestre e disciplina</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Selecionar Turma</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Escolha uma turma" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Selecionar Disciplina</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedSubject} onValueChange={setSelectedSubject} disabled={!selectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Escolha uma disciplina" />
              </SelectTrigger>
              <SelectContent>
                {filteredSubjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Selecionar Trimestre</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedTrimester} onValueChange={(value) => setSelectedTrimester(value as Trimester)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1º Trimestre</SelectItem>
                <SelectItem value="2">2º Trimestre</SelectItem>
                <SelectItem value="3">3º Trimestre</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {selectedClass && selectedSubject && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Média da Turma</CardTitle>
                <Calculator className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{classAverage.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  {getClassName(selectedClass)} - {getSubjectName(selectedSubject)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Alunos Abaixo da Média</CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {belowAverageCount} ({belowAveragePercentage}%)
                </div>
                <p className="text-xs text-muted-foreground">De {studentsInClass.length} alunos</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Nível da Turma</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <Badge className={getGradeLevelColor(getGradeLevel(classAverage))} variant="outline">
                    {getGradeLevel(classAverage)}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">Baseado na média da turma</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Médias dos Alunos</CardTitle>
              <CardDescription>
                Médias calculadas para {getSubjectName(selectedSubject)} - {selectedTrimester}º Trimestre
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome do Aluno</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-center">Média (%)</TableHead>
                    <TableHead className="text-center">Nível</TableHead>
                    <TableHead className="text-center">Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentAverages.length > 0 ? (
                    studentAverages.map(({ student, average, gradeLevel, isBelowAverage }) => (
                      <TableRow key={student.id} className={isBelowAverage ? "bg-red-50" : ""}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell className="text-center">
                          <span className="font-semibold">{average > 0 ? average.toFixed(1) : "—"}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          {average > 0 ? (
                            <Badge className={getGradeLevelColor(gradeLevel)} variant="outline">
                              {gradeLevel}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {average > 0 ? (
                            isBelowAverage ? (
                              <Badge variant="destructive">Abaixo da Média</Badge>
                            ) : (
                              <Badge variant="default" className="bg-green-600">
                                Acima da Média
                              </Badge>
                            )
                          ) : (
                            <Badge variant="secondary">Sem Notas</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        Nenhum aluno encontrado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}

      {(!selectedClass || !selectedSubject) && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calculator className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">Selecione uma turma e disciplina para ver as médias</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
