import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function TeacherAttendanceLoading() {
  return (
    <div className="space-y-6">
      <div className="h-10 bg-gray-200 rounded animate-pulse w-1/3" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
