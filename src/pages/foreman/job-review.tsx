import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"

interface Job {
  job_id: string
  job_code: string
  description: string
  status: string
  summary: string
  is_reviewed_accurate: boolean
}

export default function JobReview() {
  const { data: session } = useSession()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (session?.user?.id) {
      fetchJobs()
    }
  }, [session])

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("status", "submitted")
        .order("created_at", { ascending: false })

      if (error) throw error

      setJobs(data)
    } catch (error) {
      console.error("Error fetching jobs:", error)
      setError("Failed to load jobs")
    } finally {
      setLoading(false)
    }
  }

  const approveJob = async (jobId: string) => {
    try {
      const { error } = await supabase.from("jobs").update({ is_reviewed_accurate: true }).eq("job_id", jobId)

      if (error) throw error

      setJobs(jobs.map((job) => (job.job_id === jobId ? { ...job, is_reviewed_accurate: true } : job)))
    } catch (error) {
      console.error("Error approving job:", error)
      setError("Failed to approve job")
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Job Review</h1>
      {jobs.map((job) => (
        <Card key={job.job_id} className="mb-4">
          <CardHeader>
            <CardTitle>{job.job_code}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Description:</strong> {job.description}
            </p>
            <p>
              <strong>Summary:</strong> {job.summary}
            </p>
            <p>
              <strong>Status:</strong> {job.status}
            </p>
            <p>
              <strong>Reviewed:</strong> {job.is_reviewed_accurate ? "Yes" : "No"}
            </p>
            {!job.is_reviewed_accurate && (
              <Button onClick={() => approveJob(job.job_id)} className="mt-2">
                Approve
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

