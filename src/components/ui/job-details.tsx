"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/ui/image-upload"
import { VoiceNotes } from "@/components/ui/voice-notes"
import { SafetyReports } from "@/components/ui/safety-reports"
import { AssetDetails } from "@/components/ui/asset-details"

interface Job {
  job_id: string
  job_code: string
  description: string
  status: "pending" | "draft" | "submitted"
  summary: string
  is_reviewed_accurate: boolean
  users: { user_name: string; email: string }
  tasks: Array<{ task_id: string; task_description: string; status: string }>
  job_images: Array<{ image_id: string; image_data: string; type: string }>
}

export default function JobDetails({ jobId }: { jobId: string }) {
  const [job, setJob] = useState<Job | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [summarySteps, setSummarySteps] = useState<number>(3)
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)

  useEffect(() => {
    fetchJobDetails()
  }, [jobId])

  const fetchJobDetails = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/jobs/${jobId}`)
      if (!response.ok) throw new Error("Failed to fetch job details")
      const data = await response.json()
      setJob(data)
    } catch (err) {
      setError("Error fetching job details")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const updateJobDetails = async (updatedData: Partial<Job>) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      })
      if (!response.ok) throw new Error("Failed to update job details")
      const data = await response.json()
      setJob((prevJob) => ({ ...prevJob, ...data.job }))
    } catch (err) {
      setError("Error updating job details")
      console.error(err)
    }
  }

  const generateAISummary = async () => {
    setIsGeneratingSummary(true)
    try {
      await updateJobDetails({ generate_ai_summary: summarySteps })
      await fetchJobDetails()
    } catch (err) {
      setError("Error generating AI summary")
      console.error(err)
    } finally {
      setIsGeneratingSummary(false)
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!job) return <div>No job found</div>

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Job Details: {job.job_code}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={job.description}
                onChange={(e) => updateJobDetails({ description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={job.status}
                onValueChange={(value) => updateJobDetails({ status: value as Job["status"] })}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="summary">Summary</Label>
              <Textarea
                id="summary"
                value={job.summary}
                onChange={(e) => updateJobDetails({ summary: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="summarySteps">AI Summary Steps</Label>
              <Select
                value={summarySteps.toString()}
                onValueChange={(value) => setSummarySteps(Number.parseInt(value))}
              >
                <SelectTrigger id="summarySteps">
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
            </div>
            <div>
              <Label htmlFor="is_reviewed_accurate">Is Reviewed Accurate</Label>
              <Input
                id="is_reviewed_accurate"
                type="checkbox"
                checked={job.is_reviewed_accurate}
                onChange={(e) => updateJobDetails({ is_reviewed_accurate: e.target.checked })}
              />
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Tasks</h3>
            <ul>
              {job.tasks.map((task) => (
                <li key={task.task_id} className="mb-2">
                  {task.task_description} - {task.status}
                </li>
              ))}
            </ul>
          </div>

          <ImageUpload jobId={job.job_id} />
          <VoiceNotes jobId={job.job_id} />
          <SafetyReports jobId={job.job_id} />
          <AssetDetails jobId={job.job_id} />
        </CardContent>
      </Card>
    </div>
  )
}

