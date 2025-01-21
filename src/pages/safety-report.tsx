import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Header from "@/components/common/Header"
import BottomNav from "@/components/BottomNav"
import ImageGallery from "@/components/ImageGallery"
import VoiceNoteRecorder from "@/components/VoiceNoteRecorder"
import SafetyReportForm from "@/components/ui/SafetyReportForm"

interface JobDetails {
  job_id: string
  job_code: string
}

const SafetyReportPage: React.FC = () => {
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

  const addImage = async (jobId: string, imageData: string, type: string) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/images`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image_data: imageData, type }),
      })
      if (!response.ok) throw new Error("Failed to add image")
      const newImage = await response.json()
      return newImage.image
    } catch (error) {
      console.error("Error adding image:", error)
      throw error
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error || !jobDetails) {
    return <div>Error: {error || "Job details not found"}</div>
  }

  return (
    <div>
      <Header title={`Safety Report - ${jobDetails.job_code}`} />
      <main className="container mt-4">
        <ImageGallery jobId={jobDetails.job_id} addImage={addImage} type="safety" fetchOnLoad={true} />
        <VoiceNoteRecorder jobId={jobDetails.job_id} type="safety" />
        <SafetyReportForm jobId={jobDetails.job_id} />
      </main>
      <BottomNav activePage="safety-report" />
    </div>
  )
}

export default SafetyReportPage

