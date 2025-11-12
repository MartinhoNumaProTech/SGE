import type { User, Student, Teacher, Guardian, Assessment, SchoolClass, Classroom, Subject, Discipline } from "./types"

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin Sistema",
    email: "admin@escola.ao",
    role: "admin",
  },
  {
    id: "2",
    name: "Prof. João Silva",
    email: "joao@escola.ao",
    role: "teacher",
  },
  {
    id: "3",
    name: "Prof. Teresa Nunes",
    email: "teresa@escola.ao",
    role: "teacher",
  },
  {
    id: "4",
    name: "Prof. Pedro Alves",
    email: "pedro@escola.ao",
    role: "teacher",
  },
  {
    id: "5",
    name: "Maria Santos",
    email: "maria@email.ao",
    role: "guardian",
  },
]

export const mockSchoolClasses: SchoolClass[] = [
  {
    id: "class1",
    name: "7ª Classe",
    year: 2025,
    status: "active",
  },
  {
    id: "class2",
    name: "8ª Classe",
    year: 2025,
    status: "active",
  },
  {
    id: "class3",
    name: "9ª Classe",
    year: 2025,
    status: "active",
  },
   {
    id: "class5",
    name: "6ª Classe",
    year: 2025,
    status: "active",
  },
]

export const mockClassrooms: Classroom[] = [
  {
    id: "room1",
    name: "7ª Classe A",
    classId: "class1",
    year: 2025,
    status: "active",
  },
  {
    id: "room2",
    name: "7ª Classe B",
    classId: "class1",
    year: 2025,
    status: "active",
  },
  {
    id: "room3",
    name: "8ª Classe A",
    classId: "class2",
    year: 2025,
    status: "active",
  },
  {
    id: "room4",
    name: "8ª Classe B",
    classId: "class2",
    year: 2025,
    status: "active",
  },
]

export const mockSubjects: Subject[] = [
  {
    id: "sub1",
    name: "Matemática",
    code: "MAT",
  },
  {
    id: "sub2",
    name: "Português",
    code: "POR",
  },
  {
    id: "sub3",
    name: "Ciências",
    code: "CIE",
  },
  {
    id: "sub4",
    name: "História",
    code: "HIS",
  },
  {
    id: "sub5",
    name: "Geografia",
    code: "GEO",
  },
  {
    id: "sub6",
    name: "Inglês",
    code: "ING",
  },
]

export const mockDisciplines: Discipline[] = [
  {
    id: "disc1",
    classroomId: "room1",
    subjectId: "sub1",
    teacherId: "2",
    status: "active",
  },
  {
    id: "disc2",
    classroomId: "room1",
    subjectId: "sub2",
    teacherId: "3",
    status: "active",
  },
  {
    id: "disc3",
    classroomId: "room1",
    subjectId: "sub3",
    teacherId: "4",
    status: "active",
  },
  {
    id: "disc4",
    classroomId: "room3",
    subjectId: "sub1",
    teacherId: "2",
    status: "active",
  },
  {
    id: "disc5",
    classroomId: "room3",
    subjectId: "sub2",
    teacherId: "3",
    status: "active",
  },
  {
    id: "disc6",
    classroomId: "room3",
    subjectId: "sub3",
    teacherId: "4",
    status: "active",
  },
]

export const mockStudents: Student[] = [
  {
    id: "s1",
    name: "Ana Santos",
    dateOfBirth: "2010-05-15",
    enrollmentDate: "2020-09-01",
    guardianId: "5",
    classroomId: "room1",
    status: "active",
  },
  {
    id: "s2",
    name: "Carlos Mendes",
    dateOfBirth: "2011-03-22",
    enrollmentDate: "2021-09-01",
    guardianId: "5",
    classroomId: "room1",
    status: "active",
  },
  {
    id: "s3",
    name: "Beatriz Costa",
    dateOfBirth: "2010-08-10",
    enrollmentDate: "2020-09-01",
    guardianId: "5",
    classroomId: "room3",
    status: "active",
  },
  {
    id: "s4",
    name: "David Silva",
    dateOfBirth: "2011-01-20",
    enrollmentDate: "2021-09-01",
    guardianId: "5",
    classroomId: "room3",
    status: "active",
  },
   {
    id: "s5",
    name: "Martinho Sacaia",
    dateOfBirth: "2011-01-20",
    enrollmentDate: "2021-09-01",
    guardianId: "4",
    classroomId: "room3",
    status: "active",
  },
]

export const mockTeachers: Teacher[] = [
  {
    id: "2",
    name: "Prof. João Silva",
    email: "joao@escola.ao",
    phone: "+244 923 456 789",
    hireDate: "2018-02-01",
    status: "active",
  },
  {
    id: "3",
    name: "Prof. Teresa Nunes",
    email: "teresa@escola.ao",
    phone: "+244 923 456 790",
    hireDate: "2019-09-01",
    status: "active",
  },
  {
    id: "4",
    name: "Prof. Pedro Alves",
    email: "pedro@escola.ao",
    phone: "+244 923 456 791",
    hireDate: "2020-01-15",
    status: "active",
  },
]

export const mockGuardians: Guardian[] = [
  {
    id: "5",
    name: "Maria Santos",
    email: "maria@email.ao",
    phone: "+244 923 111 222",
    relationship: "Mãe",
    studentIds: ["s1", "s2", "s3", "s4"],
  },
  {
    id: "4",
    name: "Alcino Numa",
    email: "alcino@email.ao",
    phone: "+244 924 819 240",
    relationship: "Pai",
    studentIds: ["s5"],
  },
]

export const mockAssessments: Assessment[] = [
  {
    id: "a1",
    studentId: "s1",
    disciplineId: "disc1",
    type: "prova",
    grade: 16,
    maxGrade: 20,
    date: "2025-03-15",
    trimester: 1,
    comments: "Bom desempenho",
  },
  {
    id: "a2",
    studentId: "s1",
    disciplineId: "disc2",
    type: "prova",
    grade: 18,
    maxGrade: 20,
    date: "2025-03-20",
    trimester: 1,
    comments: "Excelente trabalho",
  },
  {
    id: "a3",
    studentId: "s2",
    disciplineId: "disc1",
    type: "prova",
    grade: 14,
    maxGrade: 20,
    date: "2025-03-15",
    trimester: 1,
  },
  {
    id: "a4",
    studentId: "s3",
    disciplineId: "disc6",
    type: "trabalho",
    grade: 17,
    maxGrade: 20,
    date: "2025-03-18",
    trimester: 1,
    comments: "Muito criativo",
  },
]
