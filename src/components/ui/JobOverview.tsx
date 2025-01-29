"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface Job {
  job_id: string
  job_code: string
  description: string
  status: string
  worker_name: string
}

export default function JobOverview({ jobId }: { jobId: string }) {
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const { data, error } = await supabase
          .from("jobs")
          .select("job_id, job_code, description, status, worker_name")
          .eq("job_id", jobId)
          .single()

        if (error) throw error
        setJob(data)
      } catch (err) {
        console.error("Error fetching job details:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchJobDetails()
  }, [jobId, supabase])

  if (loading) return <div>Loading...</div>
  if (!job) return <div>No job found</div>

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{job.job_code}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          <strong>Status:</strong> {job.status}
        </p>
        <p>
          <strong>Worker:</strong> {job.worker_name}
        </p>
        <p>
          <strong>Description:</strong> {job.description}
        </p>
        <div className="mt-4 space-x-2">
          <Button onClick={() => router.push(`/public/jobs/${job.job_id}/work-update`)}>Update Work Progress</Button>
          <Button onClick={() => router.push(`/public/jobs/${job.job_id}/asset-survey`)}>Scan Asset</Button>
          <Button onClick={() => router.push(`/public/jobs/${job.job_id}/safety-report`)}>Report Safety Issue</Button>
        </div>
      </CardContent>
    </Card>
  )
}

