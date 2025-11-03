"use client"

import { useState, useMemo } from "react"
import { useDataStore } from "@/lib/data-store"
import type { Trimester } from "@/lib/types"
import {
  calculateClassAverage,
  getStudentsBelowAverage,
  getGradeDistribution,
  getPerformanceByAssessmentType,
  calculateStudentAverage,
} from "@/lib/analytics"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, TrendingDown, Users, Award } from "lucide-react"

const GRADE_COLORS = {
  A: "#22c55e",
  B: "#3b82f6",
  C: "#f59e0b",
  D: "#f97316",
  F: "#ef4444",
}

const TYPE_COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"]

export default function AnalyticsPage() {
  const { students, classes, subjects, assessments, grades } = useDataStore()
  const [selectedTrimester, setSelectedTrimester] = useState<Trimester>("1")
  const [selectedSubject, setSelectedSubject] = useState<string>(subjects[0]?.id || "")
  const [selectedClass, setSelectedClass] = useState<string>(classes[0]?.id || "")

  // Class comparison data
  const classComparisonData = useMemo(() => {
    return classes.map((classItem) => {
      const avg = calculateClassAverage(classItem.id, selectedSubject, selectedTrimester, students, assessments, grades)
      return {
        name: classItem.name,
        average: Number(avg.toFixed(2)),
      }
    })
  }, [classes, selectedSubject, selectedTrimester, students, assessments, grades])

  // Grade distribution data
  const gradeDistributionData = useMemo(() => {
    const distribution = getGradeDistribution(
      selectedClass,
      selectedSubject,
      selectedTrimester,
      students,
      assessments,
      grades,
    )
    return Object.entries(distribution).map(([grade, count]) => ({
      name: `Grade ${grade}`,
      value: count,
      grade,
    }))
  }, [selectedClass, selectedSubject, selectedTrimester, students, assessments, grades])

  // Performance by assessment type
  const assessmentTypeData = useMemo(() => {
    const performance = getPerformanceByAssessmentType(
      selectedClass,
      selectedSubject,
      selectedTrimester,
      students,
      assessments,
      grades,
    )
    return Object.entries(performance)
      .filter(([_, avg]) => avg > 0)
      .map(([type, avg]) => ({
        name: type.charAt(0).toUpperCase() + type.slice(1),
        average: Number(avg.toFixed(2)),
      }))
  }, [selectedClass, selectedSubject, selectedTrimester, students, assessments, grades])

  // Top students data
  const topStudentsData = useMemo(() => {
    const classStudents = students.filter((s) => s.classId === selectedClass)
    return classStudents
      .map((student) => ({
        name: student.name,
        average: calculateStudentAverage(student.id, selectedSubject, selectedTrimester, assessments, grades),
      }))
      .filter((s) => s.average > 0)
      .sort((a, b) => b.average - a.average)
      .slice(0, 10)
      .map((s) => ({
        name: s.name,
        average: Number(s.average.toFixed(2)),
      }))
  }, [students, selectedClass, selectedSubject, selectedTrimester, assessments, grades])

  // Statistics
  const stats = useMemo(() => {
    const classAvg = calculateClassAverage(
      selectedClass,
      selectedSubject,
      selectedTrimester,
      students,
      assessments,
      grades,
    )
    const belowAvg = getStudentsBelowAverage(
      selectedClass,
      selectedSubject,
      selectedTrimester,
      students,
      assessments,
      grades,
    )
    const classStudents = students.filter((s) => s.classId === selectedClass)

    return {
      classAverage: classAvg.toFixed(2),
      belowAverageCount: belowAvg.count,
      belowAveragePercentage: belowAvg.percentage.toFixed(1),
      totalStudents: classStudents.length,
    }
  }, [selectedClass, selectedSubject, selectedTrimester, students, assessments, grades])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Analytics Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Performance insights and grade analytics</p>
      </div>

      <div className="flex flex-wrap gap-4">
        <Select value={selectedTrimester} onValueChange={(v) => setSelectedTrimester(v as Trimester)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Trimester 1</SelectItem>
            <SelectItem value="2">Trimester 2</SelectItem>
            <SelectItem value="3">Trimester 3</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((subject) => (
              <SelectItem key={subject.id} value={subject.id}>
                {subject.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {classes.map((classItem) => (
              <SelectItem key={classItem.id} value={classItem.id}>
                {classItem.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Class Average</CardTitle>
            <Award className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.classAverage}%</div>
            <p className="mt-1 text-xs text-muted-foreground">Current trimester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
            <Users className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.totalStudents}</div>
            <p className="mt-1 text-xs text-muted-foreground">In selected class</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Below Average</CardTitle>
            <TrendingDown className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.belowAverageCount}</div>
            <p className="mt-1 text-xs text-muted-foreground">{stats.belowAveragePercentage}% of class</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Above Average</CardTitle>
            <TrendingUp className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.totalStudents - stats.belowAverageCount}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              {(100 - Number.parseFloat(stats.belowAveragePercentage)).toFixed(1)}% of class
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Class Performance Comparison</CardTitle>
            <CardDescription>Average scores across all classes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={classComparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="average" fill="#3b82f6" name="Average Score (%)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Grade Distribution</CardTitle>
            <CardDescription>Distribution of grades in selected class</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={gradeDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => (value > 0 ? `${name}: ${value}` : "")}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {gradeDistributionData.map((entry) => (
                    <Cell key={entry.grade} fill={GRADE_COLORS[entry.grade as keyof typeof GRADE_COLORS]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance by Assessment Type</CardTitle>
            <CardDescription>Average scores by assessment type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={assessmentTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="average" fill="#8b5cf6" name="Average Score (%)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top 10 Students</CardTitle>
            <CardDescription>Highest performing students in selected class</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topStudentsData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Legend />
                <Bar dataKey="average" fill="#10b981" name="Average Score (%)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
