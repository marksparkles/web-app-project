"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Settings2 } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"

interface Task {
  task_id: string
  task_description: string
  status: string
  created_at: string
}

interface Job {
  job_id: string
  job_code: string
  description: string
  status: string
  worker_name: string
  tasks: Task[]
}

export default function JobOverview({ jobId }: { jobId: string }) {
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await fetch(`/api/jobs/${jobId}`)
        if (!response.ok) throw new Error("Failed to fetch job details")
        const data = await response.json()
        setJob(data)
      } catch (err) {
        console.error("Error fetching job details:", err)
        setError("Failed to load job details")
      } finally {
        setLoading(false)
      }
    }

    fetchJobDetails()
  }, [jobId])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!job) return <div>No job found</div>

  const pendingTasks = job.tasks.filter((task) => task.status === "pending")
  const recentTasks = job.tasks.slice(0, 5) // Get last 5 tasks

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b bg-primary px-4 text-primary-foreground">
        <h1 className="text-lg font-semibold">Job Overview: {job.job_code}</h1>
        <Button variant="ghost" size="icon">
          <Settings2 className="h-5 w-5" />
        </Button>
      </header>

      <main className="container mx-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <strong>Worker Name:</strong> {job.worker_name}
              </p>
              <p>
                <strong>Status:</strong> {job.status}
              </p>
              <p>{job.description}</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href={`/work-updates?jobId=${job.job_id}`} className="h-full">
            <Card className="h-full hover:bg-accent transition-colors cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <svg className="h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <span className="text-sm font-medium">Update Work Progress</span>
              </CardContent>
            </Card>
          </Link>

          <Link href={`/asset-survey?jobId=${job.job_id}`} className="h-full">
            <Card className="h-full hover:bg-accent transition-colors cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <svg className="h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-sm font-medium">Scan Asset</span>
              </CardContent>
            </Card>
          </Link>

          <Link href={`/safety-report?jobId=${job.job_id}`} className="h-full">
            <Card className="h-full hover:bg-accent transition-colors cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <svg className="h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span className="text-sm font-medium">Report Safety Issue</span>
              </CardContent>
            </Card>
          </Link>

          <Link href={`/voice-notes?jobId=${job.job_id}`} className="h-full">
            <Card className="h-full hover:bg-accent transition-colors cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <svg className="h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
                <span className="text-sm font-medium">Add Voice Note</span>
              </CardContent>
            </Card>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingTasks.length === 0 ? (
              <p className="text-muted-foreground">No pending tasks</p>
            ) : (
              <ul className="space-y-2">
                {pendingTasks.map((task) => (
                  <li key={task.task_id} className="flex justify-between items-center">
                    <span>{task.task_description}</span>
                    <span className="text-sm text-muted-foreground">{task.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {recentTasks.length === 0 ? (
              <p className="text-muted-foreground">No recent activity</p>
            ) : (
              <ul className="space-y-2">
                {recentTasks.map((task) => (
                  <li key={task.task_id} className="flex justify-between items-center">
                    <span>{task.task_description}</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(task.created_at).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

