import type { NextApiRequest, NextApiResponse } from "next"
import { supabase } from "@/lib/supabase"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "DELETE") {
    const { imageId } = req.query

    try {
      const { data, error } = await supabase.from("job_images").delete().eq("image_id", imageId)

      if (error) throw error

      if (!data || data.length === 0) {
        return res.status(404).json({ error: "No matching image found to delete" })
      }

      res.status(200).json({ message: "Image deleted successfully" })
    } catch (error) {
      console.error("Failed to delete image:", error)
      res.status(500).json({ error: "Error deleting image" })
    }
  } else {
    res.setHeader("Allow", ["DELETE"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

