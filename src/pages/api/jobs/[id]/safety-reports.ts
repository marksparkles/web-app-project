import type { NextApiRequest, NextApiResponse } from "next"
import { supabase } from "../../../../lib/supabase"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method === "POST") {
    const { description } = req.body

    try {
      const { data, error } = await supabase
        .from("safety_reports")
        .insert({
          job_id: id,
          description,
        })
        .select()

      if (error) throw error

      await supabase.from("tasks").insert({
        job_id: id,
        task_description: "Reported Safety Issue",
        status: "completed",
      })

      res.status(201).json({ message: "Safety report added successfully", report: data[0] })
    } catch (error) {
      console.error("Failed to add safety report:", error)
      res.status(500).json({ error: "Error adding safety report" })
    }
  } else {
    res.setHeader("Allow", ["POST"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

