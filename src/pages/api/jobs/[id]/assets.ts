import type { NextApiRequest, NextApiResponse } from "next"
import { supabase } from "../../../../lib/supabase"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method === "GET") {
    try {
      const { data, error } = await supabase
        .from("assets")
        .select("*")
        .eq("job_id", id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (error && error.code !== "PGRST116") throw error

      if (!data) {
        return res.status(200).json({
          job_id: id,
          name: "",
          status: "",
          details: {
            category: "",
            asset_condition: "",
            description: "",
            manufacturer: "",
            model: "",
            metadata: [],
          },
        })
      }

      res.status(200).json(data)
    } catch (error) {
      console.error("Failed to fetch asset details:", error)
      res.status(500).json({ error: "Error fetching asset details" })
    }
  } else if (req.method === "POST") {
    const { name, status, details } = req.body

    try {
      const { data, error } = await supabase
        .from("assets")
        .insert({
          job_id: id,
          name,
          status,
          details,
        })
        .select()

      if (error) throw error

      await supabase.from("tasks").insert({
        job_id: id,
        task_description: `Scanned Asset ${name}`,
        status: "completed",
      })

      res.status(201).json({ message: "Asset inserted successfully", asset: data[0] })
    } catch (error) {
      console.error("Failed to insert asset details:", error)
      res.status(500).json({ error: "Error inserting asset details" })
    }
  } else if (req.method === "PUT") {
    const { asset_id, name, status, details } = req.body

    try {
      const { data, error } = await supabase
        .from("assets")
        .update({ name, status, details })
        .eq("asset_id", asset_id)
        .eq("job_id", id)
        .select()

      if (error) throw error

      if (data.length === 0) {
        return res.status(404).json({ error: "No matching asset found to update" })
      }

      await supabase.from("tasks").insert({
        job_id: id,
        task_description: `Updated Asset ${name}`,
        status: "completed",
      })

      res.status(200).json({ message: "Asset updated successfully", asset: data[0] })
    } catch (error) {
      console.error("Failed to update asset details:", error)
      res.status(500).json({ error: "Error updating asset details" })
    }
  } else {
    res.setHeader("Allow", ["GET", "POST", "PUT"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

