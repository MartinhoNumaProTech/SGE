import type { Student, Assessment, Grade, Trimester, GradeLevel } from "./types"

export function calculateStudentAverage(
  studentId: string,
  subjectId: string,
  trimester: Trimester,
  assessments: Assessment[],
  grades: Grade[],
): number {
  const relevantAssessments = assessments.filter((a) => a.subjectId === subjectId && a.trimester === trimester)

  if (relevantAssessments.length === 0) return 0

  let totalWeightedScore = 0
  let totalWeight = 0

  for (const assessment of relevantAssessments) {
    const grade = grades.find((g) => g.assessmentId === assessment.id && g.studentId === studentId)
    if (grade) {
      const percentage = (grade.score / assessment.maxScore) * 100
      totalWeightedScore += percentage * assessment.weight
      totalWeight += assessment.weight
    }
  }

  return totalWeight > 0 ? totalWeightedScore / totalWeight : 0
}

export function getGradeLevel(average: number): GradeLevel {
  if (average >= 90) return "A"
  if (average >= 80) return "B"
  if (average >= 70) return "C"
  if (average >= 60) return "D"
  return "F"
}

export function calculateClassAverage(
  classId: string,
  subjectId: string,
  trimester: Trimester,
  students: Student[],
  assessments: Assessment[],
  grades: Grade[],
): number {
  const classStudents = students.filter((s) => s.classId === classId)
  if (classStudents.length === 0) return 0

  const averages = classStudents.map((student) =>
    calculateStudentAverage(student.id, subjectId, trimester, assessments, grades),
  )

  const validAverages = averages.filter((avg) => avg > 0)
  return validAverages.length > 0 ? validAverages.reduce((sum, avg) => sum + avg, 0) / validAverages.length : 0
}

export function getStudentsBelowAverage(
  classId: string,
  subjectId: string,
  trimester: Trimester,
  students: Student[],
  assessments: Assessment[],
  grades: Grade[],
): { count: number; percentage: number; total: number } {
  const classStudents = students.filter((s) => s.classId === classId)
  if (classStudents.length === 0) return { count: 0, percentage: 0, total: 0 }

  const classAvg = calculateClassAverage(classId, subjectId, trimester, students, assessments, grades)

  const belowAverage = classStudents.filter((student) => {
    const studentAvg = calculateStudentAverage(student.id, subjectId, trimester, assessments, grades)
    return studentAvg > 0 && studentAvg < classAvg
  })

  return {
    count: belowAverage.length,
    percentage: (belowAverage.length / classStudents.length) * 100,
    total: classStudents.length,
  }
}

export function getGradeDistribution(
  classId: string,
  subjectId: string,
  trimester: Trimester,
  students: Student[],
  assessments: Assessment[],
  grades: Grade[],
): Record<GradeLevel, number> {
  const classStudents = students.filter((s) => s.classId === classId)
  const distribution: Record<GradeLevel, number> = { A: 0, B: 0, C: 0, D: 0, F: 0 }

  for (const student of classStudents) {
    const average = calculateStudentAverage(student.id, subjectId, trimester, assessments, grades)
    if (average > 0) {
      const level = getGradeLevel(average)
      distribution[level]++
    }
  }

  return distribution
}

export function getPerformanceByAssessmentType(
  classId: string,
  subjectId: string,
  trimester: Trimester,
  students: Student[],
  assessments: Assessment[],
  grades: Grade[],
): Record<Assessment["type"], number> {
  const relevantAssessments = assessments.filter((a) => a.subjectId === subjectId && a.trimester === trimester)

  const typeAverages: Record<Assessment["type"], { total: number; count: number }> = {
    test: { total: 0, count: 0 },
    exam: { total: 0, count: 0 },
    assignment: { total: 0, count: 0 },
    project: { total: 0, count: 0 },
    quiz: { total: 0, count: 0 },
  }

  for (const assessment of relevantAssessments) {
    const assessmentGrades = grades.filter((g) => g.assessmentId === assessment.id)
    if (assessmentGrades.length > 0) {
      const avgScore =
        assessmentGrades.reduce((sum, g) => sum + (g.score / assessment.maxScore) * 100, 0) / assessmentGrades.length
      typeAverages[assessment.type].total += avgScore
      typeAverages[assessment.type].count++
    }
  }

  return {
    test: typeAverages.test.count > 0 ? typeAverages.test.total / typeAverages.test.count : 0,
    exam: typeAverages.exam.count > 0 ? typeAverages.exam.total / typeAverages.exam.count : 0,
    assignment: typeAverages.assignment.count > 0 ? typeAverages.assignment.total / typeAverages.assignment.count : 0,
    project: typeAverages.project.count > 0 ? typeAverages.project.total / typeAverages.project.count : 0,
    quiz: typeAverages.quiz.count > 0 ? typeAverages.quiz.total / typeAverages.quiz.count : 0,
  }
}
