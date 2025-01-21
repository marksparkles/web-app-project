import type React from "react"
import { useEffect, useState } from "react"
import Header from "@/components/common/Header"
import BottomNav from "@/components/BottomNav"
import VoiceNoteRecorder from "@/components/VoiceNoteRecorder"
import ImageGallery from "@/components/ImageGallery"
import SummarySection from "@/components/SummarySection"
import SignOffCheckbox from "@/components/SignOffCheckbox"
import ActionButtons from "@/components/ActionButtons"

interface JobDetails {
  job_id: number
  summary: string
  is_reviewed_accurate: boolean
}

interface VoiceNote {
  note_id: number
  voice_note_blob: string
  created_at: string
}

interface Photo {
  image_data: string
  image_id: number
}

const WorkUpdatesPage: React.FC = () => {
  const [summaryLength, setSummaryLength] = useState("3")
  const [summaryText, setSummaryText] = useState("")
  const [isSignedOff, setIsSignedOff] = useState(false)
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [voiceNotes, setVoiceNotes] = useState<VoiceNote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const jobDetailsFromSession = sessionStorage.getItem("jobDetails")
    if (jobDetailsFromSession) {
      const { job_id } = JSON.parse(jobDetailsFromSession)
      fetchJobDetails(job_id)
    } else {
      setError("No job details found in session. Please go back to the home page.")
      setLoading(false)
    }
  }, [])

  const fetchJobDetails = async (jobId: number) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}`)
      if (!response.ok) throw new Error("Failed to fetch job details")
      const details = await response.json()
      setJobDetails(details)
      setSummaryText(details.summary || "")
      setIsSignedOff(details.is_reviewed_accurate)
      fetchVoiceNotes(jobId, "report")
    } catch (error) {
      console.error("Failed to fetch job details:", error)
      setError("Failed to load job details. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const fetchVoiceNotes = async (jobId: number, type: string) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/voice-notes?type=${type}`)
      if (!response.ok) throw new Error("Failed to fetch voice notes")
      const notes = await response.json()
      setVoiceNotes(notes)
    } catch (error) {
      console.error("Error fetching voice notes:", error)
    }
  }

  const addImage = async (jobId: number, imageData: string, type: string) => {
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
      setPhotos((prevPhotos) => [...prevPhotos, newImage.image])
    } catch (error) {
      console.error("Error adding image:", error)
    }
  }

  if (loading) {
    return (
      <div className="text-center my-5">
        <i className="bi bi-arrow-repeat" style={{ fontSize: "3rem" }}></i>
        <h2 className="mt-3">Loading...</h2>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center my-5">
        <i className="bi bi-exclamation-triangle-fill text-danger" style={{ fontSize: "3rem" }}></i>
        <h2 className="mt-3">Oops! {error}</h2>
        <p className="lead">Please check the link or contact your supervisor for assistance.</p>
      </div>
    )
  }

  return (
    <div style={{ paddingTop: "0px" }}>
      <Header
        title="Job Report"
        style={{ position: "fixed", top: 0, width: "100%", zIndex: 1000, backgroundColor: "#007bff", color: "#fff" }}
      />

      <main
        className="container-fluid my-4 px-3"
        style={{ paddingBottom: "120px", overflowY: "auto", height: "calc(100vh - 160px)" }}
      >
        {jobDetails && (
          <>
            <ImageGallery
              jobId={jobDetails.job_id}
              addImage={addImage}
              type="job"
              photos={photos}
              setPhotos={setPhotos}
              fetchOnLoad={true}
            />

            <SummarySection
              jobId={jobDetails.job_id}
              summaryLength={summaryLength}
              setSummaryLength={setSummaryLength}
              summaryText={summaryText}
              setSummaryText={setSummaryText}
            />

            <VoiceNoteRecorder jobId={jobDetails.job_id} type="report" voiceNotes={voiceNotes} />

            <SignOffCheckbox isSignedOff={isSignedOff} setIsSignedOff={setIsSignedOff} />

            <ActionButtons jobDetails={jobDetails} summaryText={summaryText} isSignedOff={isSignedOff} />
          </>
        )}
      </main>

      <BottomNav activePage="work-updates" style={{ position: "fixed", bottom: 0, width: "100%", zIndex: 1000 }} />
    </div>
  )
}

export default WorkUpdatesPage

