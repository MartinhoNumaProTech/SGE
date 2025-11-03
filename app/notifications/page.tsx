"use client"

import { useState, useMemo } from "react"
import { useDataStore } from "@/lib/data-store"
import type { Trimester } from "@/lib/types"
import { generateReportCard, generateEmailContent } from "@/lib/report-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Eye, Send, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function NotificationsPage() {
  const { students, classes, subjects, assessments, grades } = useDataStore()
  const { toast } = useToast()
  const [selectedClass, setSelectedClass] = useState<string>(classes[0]?.id || "")
  const [selectedTrimester, setSelectedTrimester] = useState<Trimester>("1")
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set())
  const [previewStudent, setPreviewStudent] = useState<string | null>(null)
  const [sentNotifications, setSentNotifications] = useState<Set<string>>(new Set())

  const classStudents = useMemo(() => {
    return students.filter((s) => s.classId === selectedClass)
  }, [students, selectedClass])

  const classData = useMemo(() => {
    return classes.find((c) => c.id === selectedClass)
  }, [classes, selectedClass])

  const previewReportCard = useMemo(() => {
    if (!previewStudent || !classData) return null
    const student = students.find((s) => s.id === previewStudent)
    if (!student) return null
    return generateReportCard(student, selectedTrimester, subjects, assessments, grades, classData.subjectIds)
  }, [previewStudent, students, selectedTrimester, subjects, assessments, grades, classData])

  const toggleStudent = (studentId: string) => {
    setSelectedStudents((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(studentId)) {
        newSet.delete(studentId)
      } else {
        newSet.add(studentId)
      }
      return newSet
    })
  }

  const toggleAll = () => {
    if (selectedStudents.size === classStudents.length) {
      setSelectedStudents(new Set())
    } else {
      setSelectedStudents(new Set(classStudents.map((s) => s.id)))
    }
  }

  const handleSendNotifications = () => {
    if (selectedStudents.size === 0) {
      toast({
        title: "No students selected",
        description: "Please select at least one student to send notifications.",
        variant: "destructive",
      })
      return
    }

    // Simulate sending emails
    const newSent = new Set(sentNotifications)
    selectedStudents.forEach((id) => newSent.add(id))
    setSentNotifications(newSent)
    setSelectedStudents(new Set())

    toast({
      title: "Notifications sent successfully!",
      description: `Report cards sent to ${selectedStudents.size} parent(s) via email.`,
    })
  }

  const handlePreview = (studentId: string) => {
    setPreviewStudent(studentId)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Parent Notifications</h1>
          <p className="mt-2 text-muted-foreground">Send report cards to parents via email</p>
        </div>
        <Button onClick={handleSendNotifications} disabled={selectedStudents.size === 0}>
          <Send className="mr-2 h-4 w-4" />
          Send to {selectedStudents.size} Parent{selectedStudents.size !== 1 ? "s" : ""}
        </Button>
      </div>

      <div className="flex gap-4">
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
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Student List</CardTitle>
              <CardDescription>Select students to send report cards to their parents</CardDescription>
            </div>
            <Button variant="outline" onClick={toggleAll}>
              {selectedStudents.size === classStudents.length ? "Deselect All" : "Select All"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedStudents.size === classStudents.length && classStudents.length > 0}
                    onCheckedChange={toggleAll}
                  />
                </TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Parent Email</TableHead>
                <TableHead>Parent Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No students in this class
                  </TableCell>
                </TableRow>
              ) : (
                classStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedStudents.has(student.id)}
                        onCheckedChange={() => toggleStudent(student.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.parentEmail || "-"}</TableCell>
                    <TableCell>{student.parentPhone || "-"}</TableCell>
                    <TableCell>
                      {sentNotifications.has(student.id) ? (
                        <Badge className="bg-green-100 text-green-700">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Sent
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handlePreview(student.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={previewStudent !== null} onOpenChange={() => setPreviewStudent(null)}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Report Card Preview</DialogTitle>
            <DialogDescription>Preview of the email that will be sent to the parent</DialogDescription>
          </DialogHeader>
          {previewReportCard && (
            <div
              className="rounded-lg border border-border"
              dangerouslySetInnerHTML={{ __html: generateEmailContent(previewReportCard) }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  )
}
