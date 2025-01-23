import React, { useState } from "react"

const MyComponent = ({ job, session }) => {
  const [summarySteps, setSummarySteps] = useState(3) // Example state
  const [error, setError] = useState(null)
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)

  const generateAISummary = async () => {
    setIsGeneratingSummary(true)
    try {
      const response = await fetch("/api/ai-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId: job.job_id,
          steps: summarySteps,
          userId: session?.user?.id,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate AI summary")
      }

      const data = await response.json()
      setJob((prevJob) => ({ ...prevJob, ai_summary: data.summary }))
    } catch (err) {
      setError("Error generating AI summary")
      console.error(err)
    } finally {
      setIsGeneratingSummary(false)
    }
  }

  return (
    <div>
      <button onClick={generateAISummary} disabled={isGeneratingSummary}>
        {isGeneratingSummary ? "Generating..." : "Generate AI Summary"}
      </button>
      {error && <div>{error}</div>}
      {job.ai_summary && <div>AI Summary: {job.ai_summary}</div>}
    </div>
  )
}

export default MyComponent

