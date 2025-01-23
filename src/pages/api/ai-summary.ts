import type { NextApiRequest, NextApiResponse } from "next"
import { supabase } from "@/lib/supabase"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { jobId, steps } = req.body

  if (!jobId || !steps) {
    return res.status(400).json({ message: "Missing jobId or steps" })
  }

  try {
    // Fetch the job details
    const { data: job, error: jobError } = await supabase.from("jobs").select("summary").eq("job_id", jobId).single()

    if (jobError) throw jobError

    // Call your AI lambda function here
    // Replace this with your actual lambda function call
    const aiSummary = await callAILambda(job.summary, steps)

    // Update the job with the AI summary
    const { error: updateError } = await supabase
      .from("jobs")
      .update({ ai_summary: aiSummary, ai_summary_steps: steps })
      .eq("job_id", jobId)

    if (updateError) throw updateError

    // Update user usage
    const { error: usageError } = await supabase.rpc("increment_ai_summaries_used", { user_id: req.body.userId })

    if (usageError) throw usageError

    res.status(200).json({ message: "AI summary generated successfully", summary: aiSummary })
  } catch (error) {
    console.error("Error generating AI summary:", error)
    res.status(500).json({ message: "Error generating AI summary" })
  }
}

async function callAILambda(summary: string, steps: number): Promise<string> {
  // Replace this with your actual lambda function call
  // This is just a placeholder implementation
  const response = await fetch("YOUR_LAMBDA_FUNCTION_URL", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ summary, steps }),
  })

  if (!response.ok) {
    throw new Error("Failed to call AI lambda")
  }

  const data = await response.json()
  return data.aiSummary
}

