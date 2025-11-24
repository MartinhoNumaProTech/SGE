export type UserRole = "admin" | "teacher" | "guardian" | "student"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  // when role === 'student' this links the auth user to the Student record
  studentId?: string
}

export interface SchoolClass {
  id: string
  name: string // "7ª Classe", "8ª Classe", etc
  year: number
  status: "active" | "inactive"
}

export interface Classroom {
  id: string
  name: string // "7ª Classe A", "7ª Classe B", etc
  classId: string // Reference to SchoolClass
  year: number
  status: "active" | "inactive"
}

export interface Subject {
  id: string
  name: string // "Matemática", "Português", etc
  code: string
  description?: string
}

export interface Discipline {
  id: string
  classroomId: string // Reference to Classroom
  subjectId: string // Reference to Subject
  teacherId: string // Reference to Teacher
  status: "active" | "inactive"
}

export interface Student {
  id: string
  name: string
  dateOfBirth: string
  enrollmentDate: string
  classroomId: string // Changed from "class" to link to Classroom
  processNumber: string // Adicionado processNumber para vinculação com encarregado
  guardianName: string
  guardianPhone: string
  status: "active" | "inactive"
}

export interface Teacher {
  id: string
  name: string
  email: string
  phone: string
  hireDate: string
  status: "active" | "inactive"
}

export interface Guardian {
  id: string
  name: string
  email: string
  phone: string
  relationship: string
  studentIds: string[]
  processNumber: string // Adicionado processNumber para geração de credenciais
  username: string
  password: string
}

export interface Assessment {
  id: string
  studentId: string
  disciplineId: string // Changed to link to Discipline instead of teacherId
  grade: number
  maxGrade: number
  date: string
  trimester: 1 | 2 | 3
  type: "prova" | "trabalho" | "participacao"
  comments?: string
}

export interface Attendance {
  id: string
  studentId: string
  disciplineId: string
  date: string
  status: "presente" | "falta" | "justificado"
  notes?: string
}

export interface TeacherAttendance {
  id: string
  teacherId: string
  date: string
  status: "presente" | "falta" | "justificado"
  notes?: string
}
