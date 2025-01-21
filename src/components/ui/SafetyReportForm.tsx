import type React from "react"
import { useState } from "react"
import { Button } from "../../../components/ui/button"
import { Textarea } from "../../../components/ui/textarea"
import { Label } from "../../../components/ui/label"

interface SafetyReportFormProps {
  jobId: string
}

export default function SafetyReportForm({ jobId }: SafetyReportFormProps) {
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
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
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <Label htmlFor="description">Safety Report Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the safety issue..."
          required
          disabled={loading}
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit Safety Report"}
      </Button>
    </form>
  )
}

