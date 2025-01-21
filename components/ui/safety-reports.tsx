import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface SafetyReportsProps {
  jobId: string
}

export function SafetyReports({ jobId }: SafetyReportsProps) {
  const [description, setDescription] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
    }
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Safety Report</h3>
      <form onSubmit={handleSubmit}>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the safety issue..."
          className="mb-2"
          required
        />
        <Button type="submit">Submit Safety Report</Button>
      </form>
    </div>
  )
}

