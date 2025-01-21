import type { NextApiRequest, NextApiResponse } from "next"
import { supabase } from "../../../lib/supabase"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const { data: jobs, error } = await supabase
        .from("jobs")
        .select(`
          job_id,
          job_code,
          description,
          status,
          created_at,
          updated_at
        `)
        .order("created_at", { ascending: false })

      if (error) throw error

      res.status(200).json(jobs)
    } catch (error) {
      console.error("Failed to fetch jobs:", error)
      res.status(500).json({ error: "Error fetching jobs" })
    }
  } else {
    res.setHeader("Allow", ["GET"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

