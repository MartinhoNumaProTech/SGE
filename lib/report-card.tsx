import type { Student, Subject, Trimester, Assessment, Grade } from "./types"
import { calculateStudentAverage, getGradeLevel } from "./analytics"

export interface ReportCardData {
  student: Student
  trimester: Trimester
  subjects: {
    subject: Subject
    average: number
    gradeLevel: string
    assessments: {
      name: string
      score: number
      maxScore: number
      type: string
    }[]
  }[]
  overallAverage: number
  overallGradeLevel: string
  observations: string
}

export function generateReportCard(
  student: Student,
  trimester: Trimester,
  subjects: Subject[],
  assessments: Assessment[],
  grades: Grade[],
  classSubjectIds: string[],
): ReportCardData {
  const relevantSubjects = subjects.filter((s) => classSubjectIds.includes(s.id))

  const subjectData = relevantSubjects.map((subject) => {
    const average = calculateStudentAverage(student.id, subject.id, trimester, assessments, grades)
    const gradeLevel = getGradeLevel(average)

    const subjectAssessments = assessments
      .filter((a) => a.subjectId === subject.id && a.trimester === trimester)
      .map((assessment) => {
        const grade = grades.find((g) => g.assessmentId === assessment.id && g.studentId === student.id)
        return {
          name: assessment.name,
          score: grade?.score || 0,
          maxScore: assessment.maxScore,
          type: assessment.type,
        }
      })
      .filter((a) => a.score > 0)

    return {
      subject,
      average,
      gradeLevel,
      assessments: subjectAssessments,
    }
  })

  const validAverages = subjectData.filter((s) => s.average > 0).map((s) => s.average)
  const overallAverage =
    validAverages.length > 0 ? validAverages.reduce((sum, avg) => sum + avg, 0) / validAverages.length : 0
  const overallGradeLevel = getGradeLevel(overallAverage)

  let observations = ""
  if (overallAverage >= 90) {
    observations = "Excellent performance! Keep up the outstanding work."
  } else if (overallAverage >= 80) {
    observations = "Very good performance. Continue working hard."
  } else if (overallAverage >= 70) {
    observations = "Good performance. There is room for improvement in some areas."
  } else if (overallAverage >= 60) {
    observations = "Satisfactory performance. Additional support may be beneficial."
  } else {
    observations = "Performance needs improvement. Please schedule a meeting with teachers."
  }

  return {
    student,
    trimester,
    subjects: subjectData,
    overallAverage,
    overallGradeLevel,
    observations,
  }
}

export function generateEmailContent(reportCard: ReportCardData, schoolName = "SchoolHub"): string {
  const subjectsHtml = reportCard.subjects
    .filter((s) => s.average > 0)
    .map(
      (s) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${s.subject.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${s.average.toFixed(2)}%</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center; font-weight: bold;">${s.gradeLevel}</td>
    </tr>
  `,
    )
    .join("")

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Report Card - ${reportCard.student.name}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #3b82f6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0;">${schoolName}</h1>
    <p style="margin: 5px 0 0 0;">Report Card - Trimester ${reportCard.trimester}</p>
  </div>
  
  <div style="background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
    <h2 style="color: #1f2937; margin-top: 0;">Student Information</h2>
    <p><strong>Name:</strong> ${reportCard.student.name}</p>
    <p><strong>Email:</strong> ${reportCard.student.email}</p>
    <p><strong>Enrollment Date:</strong> ${new Date(reportCard.student.enrollmentDate).toLocaleDateString()}</p>
  </div>
  
  <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
    <h2 style="color: #1f2937;">Academic Performance</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="background-color: #f3f4f6;">
          <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Subject</th>
          <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb;">Average</th>
          <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb;">Grade</th>
        </tr>
      </thead>
      <tbody>
        ${subjectsHtml}
      </tbody>
    </table>
    
    <div style="margin-top: 20px; padding: 15px; background-color: #eff6ff; border-left: 4px solid #3b82f6;">
      <p style="margin: 0;"><strong>Overall Average:</strong> ${reportCard.overallAverage.toFixed(2)}%</p>
      <p style="margin: 5px 0 0 0;"><strong>Overall Grade:</strong> ${reportCard.overallGradeLevel}</p>
    </div>
  </div>
  
  <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
    <h2 style="color: #1f2937;">Observations</h2>
    <p>${reportCard.observations}</p>
  </div>
  
  <div style="background-color: #f9fafb; padding: 20px; text-align: center; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
    <p style="margin: 0; color: #6b7280; font-size: 14px;">
      ${schoolName} - School Management System<br>
      This is an automated report card notification.
    </p>
  </div>
</body>
</html>
  `
}
