// Core data types for the school management system

export type Trimester = "1" | "2" | "3"
export type GradeLevel = "A" | "B" | "C" | "D" | "F"

export interface Subject {
  id: string
  name: string
  code: string
  description?: string
  classId: string // Subjects now belong to a class
  createdAt: Date
}

export interface Class {
  id: string
  name: string
  grade: string
  year: number
  subjectIds: string[] // Removed subjectIds - subjects now reference classes instead
  createdAt: Date
}

export interface Student {
  id: string
  name: string
  email: string
  classId: string
  parentEmail?: string
  parentPhone?: string
  enrollmentDate: Date
}

export interface Assessment {
  id: string
  name: string
  subjectId: string
  classId: string
  trimester: Trimester
  type: "test" | "exam" | "assignment" | "project" | "quiz"
  maxScore: number
  weight: number
  date: Date
  createdAt: Date
}

export interface Grade {
  id: string
  studentId: string
  assessmentId: string
  score: number
  submittedAt?: Date
  notes?: string
}

export interface StudentPerformance {
  studentId: string
  studentName: string
  subjectId: string
  subjectName: string
  trimester: Trimester
  grades: Grade[]
  average: number
  gradeLevel: GradeLevel
}

export interface ClassPerformance {
  classId: string
  className: string
  subjectId: string
  subjectName: string
  trimester: Trimester
  averageScore: number
  studentsAboveAverage: number
  studentsBelowAverage: number
  totalStudents: number
}
