"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface SafetyReportsProps {
  jobId: string
}

export default function SafetyReports({ jobId }: SafetyReportsProps) {
  const [description, setDescription] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/jobs/${jobId}/safety-reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      })
      if (!response.ok) throw new Error("Failed to submit safety report")
      setDescription("")
      alert("Safety report submitted successfully")
    } catch (err) {
      console.error("Error submitting safety report:", err)
      setError("Failed to submit safety report. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Safety Report</h3>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit}>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the safety issue..."
          className="mb-2"
          required
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit Safety Report"}
        </Button>
      </form>
    </div>
  )
}

