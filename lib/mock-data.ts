import type {
  User,
  Student,
  Teacher,
  Guardian,
  Assessment,
  SchoolClass,
  Classroom,
  Subject,
  Discipline,
  Attendance,
  TeacherAttendance,
} from "./types"

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
  // Student users (previously only present as Student records). These users can log in
  // and will have the 'student' role. The `studentId` links to the Student record.
  {
    id: "u-student-1",
    name: "Ana Santos",
    email: "ana.santos@escola.ao",
    role: "student",
    studentId: "1",
  },
  {
    id: "u-student-2",
    name: "Carlos Mendes",
    email: "carlos.mendes@escola.ao",
    role: "student",
    studentId: "2",
  },
  {
    id: "u-student-3",
    name: "Beatriz Costa",
    email: "beatriz.costa@escola.ao",
    role: "student",
    studentId: "3",
  },
  {
    id: "u-student-4",
    name: "David Silva",
    email: "david.silva@escola.ao",
    role: "student",
    studentId: "4",
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
    id: "1",
    name: "Ana Santos",
    dateOfBirth: "2010-05-15",
    enrollmentDate: "2020-09-01",
    guardianId: "5",
    guardianName: "Maria Santos",
    guardianPhone: "+244 923 111 222",
    classroomId: "room1",
    processNumber: "12345",
    status: "active",
  },
  {
    id: "2",
    name: "Carlos Mendes",
    dateOfBirth: "2011-03-22",
    enrollmentDate: "2021-09-01",
    guardianId: "5",
    guardianName: "Maria Santos",
    guardianPhone: "+244 923 111 222",
    classroomId: "room1",
    processNumber: "12346",
    status: "active",
  },
  {
    id: "3",
    name: "Beatriz Costa",
    dateOfBirth: "2010-08-10",
    enrollmentDate: "2020-09-01",
    guardianId: "5",
    guardianName: "Maria Santos",
    guardianPhone: "+244 923 111 222",
    classroomId: "room3",
    processNumber: "12347",
    status: "active",
  },
  {
    id: "4",
    name: "David Silva",
    dateOfBirth: "2011-01-20",
    enrollmentDate: "2021-09-01",
    guardianId: "5",
    guardianName: "Maria Santos",
    guardianPhone: "+244 923 111 222",
    classroomId: "room3",
    processNumber: "12348",
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
    processNumber: "12345",
    studentIds: ["1", "2", "3", "4"],
    username: "P12345",
    password: "54321",
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

export const mockAttendance: Attendance[] = [
  { id: "att1", studentId: "1", disciplineId: "disc1", date: "2025-03-15", status: "presente" as const },
  { id: "att2", studentId: "1", disciplineId: "disc1", date: "2025-03-16", status: "presente" as const },
  { id: "att3", studentId: "1", disciplineId: "disc1", date: "2025-03-17", status: "falta" as const },
  { id: "att4", studentId: "2", disciplineId: "disc1", date: "2025-03-15", status: "presente" as const },
  { id: "att5", studentId: "2", disciplineId: "disc1", date: "2025-03-16", status: "justificado" as const },
  { id: "att6", studentId: "2", disciplineId: "disc1", date: "2025-03-17", status: "presente" as const },
  { id: "att7", studentId: "3", disciplineId: "disc4", date: "2025-03-15", status: "presente" as const },
  { id: "att8", studentId: "4", disciplineId: "disc4", date: "2025-03-15", status: "falta" as const },
]

export const mockTeacherAttendance: TeacherAttendance[] = [
  { id: "tatt1", teacherId: "2", date: "2025-03-15", status: "presente" as const },
  { id: "tatt2", teacherId: "2", date: "2025-03-16", status: "presente" as const },
  { id: "tatt3", teacherId: "2", date: "2025-03-17", status: "presente" as const },
  { id: "tatt4", teacherId: "3", date: "2025-03-15", status: "presente" as const },
  { id: "tatt5", teacherId: "3", date: "2025-03-16", status: "falta" as const },
  { id: "tatt6", teacherId: "3", date: "2025-03-17", status: "presente" as const },
  { id: "tatt7", teacherId: "4", date: "2025-03-15", status: "justificado" as const },
  { id: "tatt8", teacherId: "4", date: "2025-03-16", status: "presente" as const },
]

export const generateStudentAssessments = (studentId: string, classroomId: string): Assessment[] => {
  const disciplines = mockDisciplines.filter((d) => d.classroomId === classroomId)

  const assessments: Assessment[] = []
  disciplines.forEach((discipline, index) => {
    const baseDate = new Date(2025, 2, 10 + index * 2)
    assessments.push({
      id: `a${Date.now()}-${index}`,
      studentId,
      disciplineId: discipline.id,
      type: index % 2 === 0 ? "prova" : "trabalho",
      grade: Math.floor(Math.random() * 5) + 14,
      maxGrade: 20,
      date: baseDate.toISOString().split("T")[0],
      trimester: 1,
      comments: "Avaliação automática ao registar aluno",
    })
  })
  return assessments
}

export const generateStudentAttendance = (studentId: string, classroomId: string): Attendance[] => {
  const disciplines = mockDisciplines.filter((d) => d.classroomId === classroomId)
  const attendance: Attendance[] = []

  disciplines.forEach((discipline) => {
    for (let i = 0; i < 10; i++) {
      const date = new Date(2025, 2, 1 + i)
      const statuses = ["presente", "presente", "presente", "falta", "justificado"] as const
      attendance.push({
        id: `att${Date.now()}-${i}`,
        studentId,
        disciplineId: discipline.id,
        date: date.toISOString().split("T")[0],
        status: statuses[Math.floor(Math.random() * statuses.length)],
      })
    }
  })
  return attendance
}
