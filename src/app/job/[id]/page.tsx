import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { notFound } from "next/navigation"
import { Clipboard, Clock, ListTodo } from "lucide-react"

interface PageProps {
  params: {
    id: string
  }
}

export default function JobPage({ params }: PageProps) {

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-background text-foreground">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Job Details: {params.id}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Clipboard className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Description</h2>
            </div>
            <p className="text-muted-foreground pl-7">Job description for {params.id} will go here</p>

            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Status</h2>
            </div>
            <p className="text-muted-foreground pl-7">Current status of {params.id}</p>

            <div className="flex items-center space-x-2">
              <ListTodo className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Tasks</h2>
            </div>
            <p className="text-muted-foreground pl-7">Tasks for {params.id} will be listed here</p>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

