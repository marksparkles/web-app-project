import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Header from "@/components/common/Header"
import BottomNav from "@/components/BottomNav"
import AssetForm from "@/components/AssetForm"

interface JobDetails {
  job_id: number
  job_code: string
}

const AssetSurveyPage: React.FC = () => {
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const jobDetailsFromSession = sessionStorage.getItem("jobDetails")
    if (jobDetailsFromSession) {
      setJobDetails(JSON.parse(jobDetailsFromSession))
      setLoading(false)
    } else {
      setError("No job details found in session. Please go back to the home page.")
      setLoading(false)
    }
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error || !jobDetails) {
    return <div>Error: {error || "Job details not found"}</div>
  }

  return (
    <div>
      <Header title={`Asset Survey - ${jobDetails.job_code}`} />
      <main className="container mt-4">
        <AssetForm jobId={jobDetails.job_id} />
      </main>
      <BottomNav activePage="asset-survey" />
    </div>
  )
}

export default AssetSurveyPage

