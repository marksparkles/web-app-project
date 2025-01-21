import type { NextApiRequest, NextApiResponse } from "next"
import { supabase } from "../../../../lib/supabase"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { id } = req.query
    const { image_data, type } = req.body

    try {
      const { data, error } = await supabase
        .from("job_images")
        .insert({
          job_id: id,
          image_data,
          type: type || "job",
        })
        .select()

      if (error) throw error

      res.status(201).json({ message: "Job image added successfully", image: data[0] })
    } catch (error) {
      console.error("Failed to add image:", error)
      res.status(500).json({ error: "Error adding image" })
    }
  } else if (req.method === "GET") {
    const { id } = req.query
    const { type } = req.query

    try {
      const { data, error } = await supabase.from("job_images").select("*").eq("job_id", id).eq("type", type)

      if (error) throw error

      res.status(200).json(data)
    } catch (error) {
      console.error("Failed to fetch images:", error)
      res.status(500).json({ error: "Error fetching images" })
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

