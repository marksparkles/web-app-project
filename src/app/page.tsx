"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import TradesmanDashboard from "@/components/dashboard/TradesmanDashboard"
import { JobOverviewNew } from "@/components/ui/JobOverviewNew"
import { JobDetails } from "@/components/ui/JobDetails"

export default function Home() {
  const [jobs, setJobs] = useState([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    const { data, error } = await supabase.from("jobs").select("*").order("created_at", { ascending: false })
    if (error) console.error("Error fetching jobs:", error)
    else setJobs(data)
  }

  return <TradesmanDashboard jobs={jobs} />
}

