"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Subject, Class, Student, Assessment, Grade } from "./types"

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface DataStore {
  isAuthenticated: boolean
  user: User | null
  login: (email: string, password: string) => boolean
  logout: () => void

  subjects: Subject[]
  classes: Class[]
  students: Student[]
  assessments: Assessment[]
  grades: Grade[]

  // Subject actions
  addSubject: (subject: Subject) => void
  updateSubject: (id: string, subject: Partial<Subject>) => void
  deleteSubject: (id: string) => void

  // Class actions
  addClass: (classData: Class) => void
  updateClass: (id: string, classData: Partial<Class>) => void
  deleteClass: (id: string) => void

  // Student actions
  addStudent: (student: Student) => void
  updateStudent: (id: string, student: Partial<Student>) => void
  deleteStudent: (id: string) => void

  // Assessment actions
  addAssessment: (assessment: Assessment) => void
  updateAssessment: (id: string, assessment: Partial<Assessment>) => void
  deleteAssessment: (id: string) => void

  // Grade actions
  addGrade: (grade: Grade) => void
  updateGrade: (id: string, grade: Partial<Grade>) => void
  deleteGrade: (id: string) => void
}

const mockSubjects: Subject[] = [
  {
    id: "1",
    name: "Matemática",
    code: "MAT101",
    description: "Matemática Básica",
    classId: "1",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    name: "Português",
    code: "PORT101",
    description: "Língua Portuguesa",
    classId: "1",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "3",
    name: "Ciências",
    code: "CIE101",
    description: "Ciências Gerais",
    classId: "1",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "4",
    name: "História",
    code: "HIST101",
    description: "História Mundial",
    classId: "2",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "5",
    name: "Inglês",
    code: "ING101",
    description: "Língua Inglesa",
    classId: "2",
    createdAt: new Date("2024-01-01"),
  },
]

const mockClasses: Class[] = [
  {
    id: "1",
    name: "5º Ano A",
    grade: "5",
    year: 2025,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    name: "5º Ano B",
    grade: "5",
    year: 2025,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "3",
    name: "6º Ano A",
    grade: "6",
    year: 2025,
    createdAt: new Date("2024-01-01"),
  },
]

const mockStudents: Student[] = [
  {
    id: "1",
    name: "Ana Silva",
    email: "ana.silva@escola.com",
    classId: "1",
    parentEmail: "encarregado.silva@email.com",
    enrollmentDate: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Bruno Santos",
    email: "bruno.santos@escola.com",
    classId: "1",
    parentEmail: "encarregado.santos@email.com",
    enrollmentDate: new Date("2024-01-15"),
  },
  {
    id: "3",
    name: "Carla Oliveira",
    email: "carla.oliveira@escola.com",
    classId: "1",
    parentEmail: "encarregado.oliveira@email.com",
    enrollmentDate: new Date("2024-01-15"),
  },
  {
    id: "4",
    name: "Daniel Costa",
    email: "daniel.costa@escola.com",
    classId: "2",
    parentEmail: "encarregado.costa@email.com",
    enrollmentDate: new Date("2024-01-15"),
  },
  {
    id: "5",
    name: "Elena Ferreira",
    email: "elena.ferreira@escola.com",
    classId: "2",
    parentEmail: "encarregado.ferreira@email.com",
    enrollmentDate: new Date("2024-01-15"),
  },
  {
    id: "6",
    name: "Felipe Alves",
    email: "felipe.alves@escola.com",
    classId: "3",
    parentEmail: "encarregado.alves@email.com",
    enrollmentDate: new Date("2024-01-15"),
  },
]

const mockAssessments: Assessment[] = [
  {
    id: "1",
    name: "Teste de Matemática 1",
    subjectId: "1",
    classId: "1",
    trimester: "1",
    type: "test",
    maxScore: 100,
    weight: 0.3,
    date: new Date("2025-02-15"),
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "2",
    name: "Exame de Matemática",
    subjectId: "1",
    classId: "1",
    trimester: "1",
    type: "exam",
    maxScore: 100,
    weight: 0.5,
    date: new Date("2025-03-20"),
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "3",
    name: "Redação de Português",
    subjectId: "2",
    classId: "1",
    trimester: "1",
    type: "assignment",
    maxScore: 100,
    weight: 0.4,
    date: new Date("2025-02-20"),
    createdAt: new Date("2025-01-01"),
  },
]

const mockGrades: Grade[] = [
  { id: "1", studentId: "1", assessmentId: "1", score: 85, submittedAt: new Date("2025-02-15") },
  { id: "2", studentId: "2", assessmentId: "1", score: 72, submittedAt: new Date("2025-02-15") },
  { id: "3", studentId: "3", assessmentId: "1", score: 91, submittedAt: new Date("2025-02-15") },
  { id: "4", studentId: "1", assessmentId: "2", score: 88, submittedAt: new Date("2025-03-20") },
  { id: "5", studentId: "2", assessmentId: "2", score: 65, submittedAt: new Date("2025-03-20") },
  { id: "6", studentId: "3", assessmentId: "2", score: 95, submittedAt: new Date("2025-03-20") },
]

export const useDataStore = create<DataStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (email: string, password: string) => {
        if (email && password) {
          const user: User = {
            id: "1",
            name: "Administrador",
            email: email,
            role: "admin",
          }
          set({ isAuthenticated: true, user })
          return true
        }
        return false
      },
      logout: () => {
        set({ isAuthenticated: false, user: null })
      },

      subjects: mockSubjects,
      classes: mockClasses,
      students: mockStudents,
      assessments: mockAssessments,
      grades: mockGrades,

      addSubject: (subject) => set((state) => ({ subjects: [...state.subjects, subject] })),
      updateSubject: (id, subject) =>
        set((state) => ({
          subjects: state.subjects.map((s) => (s.id === id ? { ...s, ...subject } : s)),
        })),
      deleteSubject: (id) =>
        set((state) => ({
          subjects: state.subjects.filter((s) => s.id !== id),
        })),

      addClass: (classData) => set((state) => ({ classes: [...state.classes, classData] })),
      updateClass: (id, classData) =>
        set((state) => ({
          classes: state.classes.map((c) => (c.id === id ? { ...c, ...classData } : c)),
        })),
      deleteClass: (id) =>
        set((state) => ({
          classes: state.classes.filter((c) => c.id !== id),
        })),

      addStudent: (student) => set((state) => ({ students: [...state.students, student] })),
      updateStudent: (id, student) =>
        set((state) => ({
          students: state.students.map((s) => (s.id === id ? { ...s, ...student } : s)),
        })),
      deleteStudent: (id) =>
        set((state) => ({
          students: state.students.filter((s) => s.id !== id),
        })),

      addAssessment: (assessment) => set((state) => ({ assessments: [...state.assessments, assessment] })),
      updateAssessment: (id, assessment) =>
        set((state) => ({
          assessments: state.assessments.map((a) => (a.id === id ? { ...a, ...assessment } : a)),
        })),
      deleteAssessment: (id) =>
        set((state) => ({
          assessments: state.assessments.filter((a) => a.id !== id),
        })),

      addGrade: (grade) => set((state) => ({ grades: [...state.grades, grade] })),
      updateGrade: (id, grade) =>
        set((state) => ({
          grades: state.grades.map((g) => (g.id === id ? { ...g, ...grade } : g)),
        })),
      deleteGrade: (id) =>
        set((state) => ({
          grades: state.grades.filter((g) => g.id !== id),
        })),
    }),
    {
      name: "school-management-storage",
      partialize: (state) => ({ isAuthenticated: state.isAuthenticated, user: state.user }),
    },
  ),
)
