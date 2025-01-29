import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Error } from "@/components/ui/Error"
import { Loading } from "@/components/ui/Loading"

interface Job {
  job_id: string
  job_code: string
  description: string
  status: string
  ai_summary?: string
  organisation_id: string
}

interface JobDetailsProps {
  job: Job
  session: any
}

const JobDetails: React.FC<JobDetailsProps> = ({ job, session }) => {
  const [summarySteps, setSummarySteps] = useState<string>("3")
  const [error, setError] = useState<string | null>(null)
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)
  const [aiSummary, setAiSummary] = useState(job.ai_summary || "")

  const generateAISummary = async () => {
    setIsGeneratingSummary(true)
    setError(null)
    try {
      const response = await fetch("/api/ai-operations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          operation: "job_summary",
          jobId: job.job_id,
          organisationId: job.organisation_id,
          text: job.description,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate AI summary")
      }

      const data = await response.json()
      setAiSummary(data.data.summary)

      // Update the job with the new AI summary
      await fetch(`/api/jobs/${job.job_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ai_summary: data.data.summary,
        }),
      })
    } catch (err) {
      setError("Error generating AI summary")
      console.error(err)
    } finally {
      setIsGeneratingSummary(false)
    }
  }

  if (!job) return <Error message="No job details found" />

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Details: {job.job_code}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={job.description} readOnly />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Input id="status" value={job.status} readOnly />
          </div>
          <div>
            <h3 className="text-lg font-semibold">AI Summary</h3>
            <Select value={summarySteps} onValueChange={setSummarySteps}>
              <SelectTrigger>
                <SelectValue placeholder="Select number of steps" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 Steps</SelectItem>
                <SelectItem value="5">5 Steps</SelectItem>
                <SelectItem value="10">10 Steps</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={generateAISummary} disabled={isGeneratingSummary} className="mt-2">
              {isGeneratingSummary ? "Generating..." : "Generate AI Summary"}
            </Button>
            {error && <Error message={error} />}
            {isGeneratingSummary && <Loading />}
            {aiSummary && (
              <div className="mt-4 p-4 bg-gray-100 rounded">
                <h4 className="font-semibold">AI Generated Summary:</h4>
                <p>{aiSummary}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default JobDetails

