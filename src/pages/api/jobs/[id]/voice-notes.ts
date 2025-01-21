import type { NextApiRequest, NextApiResponse } from "next"
import { supabase } from "../../../../lib/supabase"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method === "POST") {
    const { voice_note_data, type } = req.body

    try {
      const { data, error } = await supabase
        .from("job_voice_notes")
        .insert({
          job_id: id,
          voice_note_blob: voice_note_data,
          type: type || "general",
        })
        .select()

      if (error) throw error

      await supabase.from("tasks").insert({
        job_id: id,
        task_description: `Created voice note of type ${type}`,
        status: "completed",
      })

      res.status(201).json({ message: "Voice note added successfully", note: data[0] })
    } catch (error) {
      console.error("Failed to add voice note:", error)
      res.status(500).json({ error: "Error adding voice note" })
    }
  } else if (req.method === "GET") {
    const { type } = req.query

    try {
      const { data, error } = await supabase.from("job_voice_notes").select("*").eq("job_id", id).eq("type", type)

      if (error) throw error

      res.status(200).json(data)
    } catch (error) {
      console.error("Failed to fetch voice notes:", error)
      res.status(500).json({ error: "Error fetching voice notes" })
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

