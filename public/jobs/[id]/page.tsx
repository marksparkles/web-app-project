"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mic, FileText, AlertTriangle, Barcode } from "lucide-react"
import { Loading } from "@/components/ui/Loading"
import { Error } from "@/components/ui/Error"

interface Job {
  job_id: string
  job_code: string
  description: string | null
  status: string
}

interface Task {
  task_id: string
  task_description: string
  status: string
}

interface Activity {
  id: string
  type: string
  description: string
  created_at: string
}

export default function PublicJobView({ params }: { params: { id: string } }) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [job, setJob] = useState<Job | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchJobDetails()
  }, [])

  const fetchJobDetails = async () => {
    try {
      const { data: jobData, error: jobError } = await supabase
        .from("jobs")
        .select("*")
        .eq("job_id", params.id)
        .single()

      if (jobError) throw jobError
      setJob(jobData)

      // Fetch tasks
      const { data: taskData, error: taskError } = await supabase.from("tasks").select("*").eq("job_id", params.id)

      if (taskError) throw taskError
      setTasks(taskData || [])

      // Fetch recent activities
      const { data: activityData, error: activityError } = await supabase
        .from("activities")
        .select("*")
        .eq("job_id", params.id)
        .order("created_at", { ascending: false })
        .limit(5)

      if (activityError) {
        console.warn("Could not fetch activities:", activityError)
        setActivities([])
      } else {
        setActivities(activityData || [])
      }
    } catch (err) {
      console.error("Error fetching job details:", err)
      setError("Could not load job details")
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} />
  if (!job) return <Error message="Job not found" />

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Job Overview: {job.job_code}</h1>
        </div>
      </div>

      <div className="container mx-auto p-4 space-y-6">
        {/* Job Details */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div>
              <h2 className="font-semibold mb-2">Job Description</h2>
              <p>{job.description || "No description provided"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium capitalize">{job.status}</p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Button className="h-24" onClick={() => router.push(`/public/jobs/${job.job_id}/work-update`)}>
            <div className="flex flex-col items-center gap-2">
              <FileText className="h-6 w-6" />
              <span>Update Work Progress</span>
            </div>
          </Button>
          <Button className="h-24" onClick={() => router.push(`/public/jobs/${job.job_id}/asset-survey`)}>
            <div className="flex flex-col items-center gap-2">
              <Barcode className="h-6 w-6" />
              <span>Scan Asset</span>
            </div>
          </Button>
          <Button className="h-24" onClick={() => router.push(`/public/jobs/${job.job_id}/safety-report`)}>
            <div className="flex flex-col items-center gap-2">
              <AlertTriangle className="h-6 w-6" />
              <span>Report Safety Issue</span>
            </div>
          </Button>
          <Button className="h-24" onClick={() => router.push(`/public/jobs/${job.job_id}/voice-note`)}>
            <div className="flex flex-col items-center gap-2">
              <Mic className="h-6 w-6" />
              <span>Add Voice Note</span>
            </div>
          </Button>
        </div>

        {/* Pending Tasks */}
        {tasks.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h2 className="font-semibold mb-4">Pending Tasks</h2>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.task_id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{task.task_description}</p>
                      <p className="text-sm text-muted-foreground">Status: {task.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Activity */}
        <Card>
          <CardContent className="p-6">
            <h2 className="font-semibold mb-4">Recent Activity</h2>
            {activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{activity.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(activity.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No recent activity</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t">
        <div className="container mx-auto grid grid-cols-4 divide-x">
          <Button variant="ghost" className="h-16 rounded-none" onClick={() => router.push("/")}>
            Home
          </Button>
          <Button
            variant="ghost"
            className="h-16 rounded-none"
            onClick={() => router.push(`/public/jobs/${job.job_id}/safety-report`)}
          >
            Safety Report
          </Button>
          <Button
            variant="ghost"
            className="h-16 rounded-none"
            onClick={() => router.push(`/public/jobs/${job.job_id}/work-update`)}
          >
            Work Updates
          </Button>
          <Button
            variant="ghost"
            className="h-16 rounded-none"
            onClick={() => router.push(`/public/jobs/${job.job_id}/asset-survey`)}
          >
            Assets
          </Button>
        </div>
      </div>
    </div>
  )
}

