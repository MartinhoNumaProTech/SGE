"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, TrendingDown, Minus, Award, BookOpen, Calendar } from "lucide-react"
import { mockAssessments, mockStudents, mockGuardians, mockTeachers } from "@/lib/mock-data"
import { useAuth } from "@/contexts/auth-context"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function ReportsPage() {
  const { user } = useAuth()
  const isGuardian = user?.role === "guardian"
  const isStudent = user?.role === "student"
  const guardian = isGuardian ? mockGuardians.find((g) => g.id === user?.id) : undefined
  const students = isGuardian
    ? mockStudents.filter((s) => guardian?.studentIds.includes(s.id))
    : isStudent
    ? mockStudents.filter((s) => s.id === user?.studentId)
    : []
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || "")

  const selectedStudent = students.find((s) => s.id === selectedStudentId)
  const studentAssessments = mockAssessments.filter((a) => a.studentId === selectedStudentId)

  const calculateAverage = (assessments: typeof mockAssessments) => {
    if (assessments.length === 0) return 0
    return assessments.reduce((sum, a) => sum + (a.grade / a.maxGrade) * 20, 0) / assessments.length
  }

  const getSubjectAverages = () => {
    const subjects = new Set(studentAssessments.map((a) => a.subject))
    return Array.from(subjects).map((subject) => {
      const subjectAssessments = studentAssessments.filter((a) => a.subject === subject)
      return {
        subject,
        average: calculateAverage(subjectAssessments),
        count: subjectAssessments.length,
      }
    })
  }

  const getTrimesterAverages = () => {
    return [1, 2, 3].map((trimester) => {
      const trimesterAssessments = studentAssessments.filter((a) => a.trimester === trimester)
      return {
        trimester: `${trimester}º Trim.`,
        average: calculateAverage(trimesterAssessments),
        count: trimesterAssessments.length,
      }
    })
  }

  const getPerformanceTrend = () => {
    const trimesterAverages = getTrimesterAverages()
    if (trimesterAverages.length < 2) return "stable"

    const lastTwo = trimesterAverages.filter((t) => t.count > 0).slice(-2)
    if (lastTwo.length < 2) return "stable"

    const diff = lastTwo[1].average - lastTwo[0].average
    if (diff > 1) return "up"
    if (diff < -1) return "down"
    return "stable"
  }

  const getTeacherName = (teacherId: string) => {
    const teacher = mockTeachers.find((t) => t.id === teacherId)
    return teacher?.name || "N/A"
  }

  const getTypeLabel = (type: string) => {
    const types = {
      prova: "Prova",
      trabalho: "Trabalho",
      participacao: "Participação",
    }
    return types[type as keyof typeof types] || type
  }

  const overallAverage = calculateAverage(studentAssessments)
  const subjectAverages = getSubjectAverages()
  const trimesterAverages = getTrimesterAverages()
  const performanceTrend = getPerformanceTrend()

  const chartData = subjectAverages.map((s) => ({
    subject: s.subject,
    nota: Number.parseFloat(s.average.toFixed(1)),
  }))

  return (
    <ProtectedRoute allowedRoles={["guardian", "student"]}>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Relatórios de Desempenho</h1>
              <p className="text-muted-foreground mt-1">Acompanhe o progresso dos seus educandos</p>
            </div>
            {students.length > 1 && (
              <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {selectedStudent && (
            <>
              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Média Geral</CardTitle>
                    <Award className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{overallAverage.toFixed(1)}</div>
                    <p className="text-xs text-muted-foreground mt-1">De {studentAssessments.length} avaliações</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Disciplinas</CardTitle>
                    <BookOpen className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{subjectAverages.length}</div>
                    <p className="text-xs text-muted-foreground mt-1">Avaliadas</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Tendência</CardTitle>
                    {performanceTrend === "up" && <TrendingUp className="h-4 w-4 text-green-600" />}
                    {performanceTrend === "down" && <TrendingDown className="h-4 w-4 text-red-600" />}
                    {performanceTrend === "stable" && <Minus className="h-4 w-4 text-gray-600" />}
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {performanceTrend === "up" && "Subindo"}
                      {performanceTrend === "down" && "Descendo"}
                      {performanceTrend === "stable" && "Estável"}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Últimos trimestres</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Classe</CardTitle>
                    <Calendar className="h-4 w-4 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedStudent.class}</div>
                    <p className="text-xs text-muted-foreground mt-1">Ano letivo 2025</p>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                  <TabsTrigger value="subjects">Por Disciplina</TabsTrigger>
                  <TabsTrigger value="assessments">Todas Avaliações</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Desempenho por Disciplina</CardTitle>
                      <CardDescription>Média de notas em cada disciplina</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {chartData.length > 0 ? (
                        <ChartContainer
                          config={{
                            nota: {
                              label: "Nota",
                              color: "hsl(var(--chart-1))",
                            },
                          }}
                          className="h-[300px]"
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="subject" />
                              <YAxis domain={[0, 20]} />
                              <ChartTooltip content={<ChartTooltipContent />} />
                              <Bar dataKey="nota" fill="var(--color-nota)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      ) : (
                        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                          Nenhum dado disponível
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Desempenho por Trimestre</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {trimesterAverages.map((trim, index) => (
                          <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
                            <div>
                              <p className="font-medium">{trim.trimester}</p>
                              <p className="text-sm text-muted-foreground">{trim.count} avaliações</p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold">{trim.count > 0 ? trim.average.toFixed(1) : "-"}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="subjects" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    {subjectAverages.map((subject) => (
                      <Card key={subject.subject}>
                        <CardHeader>
                          <CardTitle className="text-lg">{subject.subject}</CardTitle>
                          <CardDescription>{subject.count} avaliações registradas</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Média</span>
                              <span className="text-2xl font-bold">{subject.average.toFixed(1)}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${(subject.average / 20) * 100}%` }}
                              />
                            </div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>0</span>
                              <span>20</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="assessments">
                  <Card>
                    <CardHeader>
                      <CardTitle>Histórico de Avaliações</CardTitle>
                      <CardDescription>Todas as avaliações de {selectedStudent.name}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Data</TableHead>
                            <TableHead>Disciplina</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Professor</TableHead>
                            <TableHead>Nota</TableHead>
                            <TableHead>Trimestre</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {studentAssessments.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                Nenhuma avaliação encontrada
                              </TableCell>
                            </TableRow>
                          ) : (
                            studentAssessments
                              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                              .map((assessment) => (
                                <TableRow key={assessment.id}>
                                  <TableCell>{new Date(assessment.date).toLocaleDateString("pt-AO")}</TableCell>
                                  <TableCell className="font-medium">{assessment.subject}</TableCell>
                                  <TableCell>
                                    <Badge variant="outline">{getTypeLabel(assessment.type)}</Badge>
                                  </TableCell>
                                  <TableCell>{getTeacherName(assessment.teacherId)}</TableCell>
                                  <TableCell>
                                    <span className="font-medium">
                                      {assessment.grade}/{assessment.maxGrade}
                                    </span>
                                    <span className="text-muted-foreground text-sm ml-2">
                                      ({((assessment.grade / assessment.maxGrade) * 20).toFixed(1)})
                                    </span>
                                  </TableCell>
                                  <TableCell>{assessment.trimester}º Trim.</TableCell>
                                </TableRow>
                              ))
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}

          {!selectedStudent && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Nenhum educando encontrado</p>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
