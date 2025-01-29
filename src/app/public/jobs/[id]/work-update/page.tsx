"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loading } from "@/components/ui/Loading"
import { Error } from "@/components/ui/Error"

interface Job {
  job_id: string
  job_code: string
  description: string | null
  status: string
}

export default function WorkUpdate({ params }: { params: { id: string } }) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [job, setJob] = useState<Job | null>(null)
  const [update, setUpdate] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchJobDetails()
  }, [])

  const fetchJobDetails = async () => {
    try {
      const { data, error } = await supabase.from("jobs").select("*").eq("job_id", params.id).single()

      if (error) throw error
      setJob(data)
    } catch (err) {
      console.error("Error fetching job:", err)
      setError("Could not load job details")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!update.trim()) return

    setSubmitting(true)
    try {
      const { error } = await supabase.from("activities").insert({
        job_id: params.id,
        type: "work_update",
        description: update,
      })

      if (error) throw error

      // Return to job details page after successful submission
      router.push(`/public/jobs/${params.id}`)
    } catch (err) {
      console.error("Error submitting update:", err)
      setError("Failed to submit update")
    } finally {
      setSubmitting(false)
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
          <h1 className="text-2xl font-bold">Update Work Progress</h1>
          <p className="text-primary-foreground/70">Job: {job.job_code}</p>
        </div>
      </div>

      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="update" className="block text-sm font-medium mb-2">
                  Work Update
                </label>
                <Textarea
                  id="update"
                  value={update}
                  onChange={(e) => setUpdate(e.target.value)}
                  placeholder="Describe the work progress..."
                  className="min-h-[200px]"
                  required
                />
              </div>
              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.push(`/public/jobs/${params.id}`)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Update"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

