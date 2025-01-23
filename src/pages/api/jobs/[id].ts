import type { NextApiRequest, NextApiResponse } from "next"
import { supabase } from "../../../lib/supabase"
import { generateAISummary } from "../../../lib/ai"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method === "GET") {
    try {
      const { data: job, error: jobError } = await supabase
        .from("jobs")
        .select(`
          *,
          users:user_id (user_name, email),
          tasks (task_id, task_description, status, created_at, updated_at),
          job_images (image_id, image_data, type, created_at, updated_at)
        `)
        .eq("job_id", id)
        .single()

      if (jobError) throw jobError

      if (!job) {
        return res.status(404).json({ error: "Job not found" })
      }

      res.status(200).json(job)
    } catch (error) {
      console.error("Failed to fetch job details:", error)
      res.status(500).json({ error: "Error fetching job details" })
    }
  } else if (req.method === "PUT") {
    const { summary, is_reviewed_accurate, status, generate_ai_summary } = req.body

    try {
      const updatedJob = { summary, is_reviewed_accurate, status }

      if (generate_ai_summary) {
        const aiSummary = await generateAISummary(summary, generate_ai_summary)
        updatedJob.summary = aiSummary
      }

      const { data, error } = await supabase.from("jobs").update(updatedJob).eq("job_id", id).select()

      if (error) throw error

      let message = "Updated work progress"
      if (status === "submitted") {
        message = "Completed work progress"

        await supabase.from("tasks").delete().eq("job_id", id).eq("task_description", "Complete Job")
      }

      await supabase.from("tasks").insert({
        job_id: id,
        task_description: message,
        status: "completed",
      })

      res.status(200).json({ message: "Job updated successfully", job: data[0] })
    } catch (error) {
      console.error("Failed to update job details:", error)
      res.status(500).json({ error: "Error updating job details" })
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

