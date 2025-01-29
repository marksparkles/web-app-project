"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"

interface VoiceNotesProps {
  jobId: string
}

export default function VoiceNotes({ jobId }: VoiceNotesProps) {
  const [voiceNotes, setVoiceNotes] = useState<Array<{ note_id: string; voice_note_blob: string; type: string }>>([])
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [noteType, setNoteType] = useState<string>("general")
  const [error, setError] = useState<string | null>(null)

  const fetchVoiceNotes = useCallback(async () => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/voice-notes?type=${noteType}`)
      if (!response.ok) throw new Error("Failed to fetch voice notes")
      const data = await response.json()
      setVoiceNotes(data)
      setError(null)
    } catch (err) {
      console.error("Error fetching voice notes:", err)
      setError("Failed to fetch voice notes. Please try again.")
    }
  }, [jobId, noteType])

  useEffect(() => {
    fetchVoiceNotes()
  }, [jobId, noteType, fetchVoiceNotes])

  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream)
        const audioChunks: BlobPart[] = []

        mediaRecorder.addEventListener("dataavailable", (event) => {
          audioChunks.push(event.data)
        })

        mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks)
          setAudioBlob(audioBlob)
        })

        mediaRecorder.start()
        setIsRecording(true)

        setTimeout(() => {
          mediaRecorder.stop()
          setIsRecording(false)
        }, 5000) // Stop recording after 5 seconds
      })
      .catch((err) => {
        console.error("Error accessing microphone:", err)
        setError("Failed to access microphone. Please check your permissions.")
      })
  }

  const uploadVoiceNote = async () => {
    if (!audioBlob) return

    const reader = new FileReader()
    reader.readAsDataURL(audioBlob)
    reader.onloadend = async () => {
      const base64AudioMessage = reader.result
      if (typeof base64AudioMessage !== "string") return

      try {
        const response = await fetch(`/api/jobs/${jobId}/voice-notes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            voice_note_data: base64AudioMessage.split(",")[1],
            type: noteType,
          }),
        })
        if (!response.ok) throw new Error("Failed to upload voice note")
        await fetchVoiceNotes()
        setAudioBlob(null)
        setError(null)
      } catch (err) {
        console.error("Error uploading voice note:", err)
        setError("Failed to upload voice note. Please try again.")
      }
    }
  }

  return (
    <div className="mt-6">
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <h3 className="text-lg font-semibold mb-2">Voice Notes</h3>
      <div className="mb-4">
        <Button onClick={startRecording} disabled={isRecording}>
          {isRecording ? "Recording..." : "Start Recording"}
        </Button>
        <select value={noteType} onChange={(e) => setNoteType(e.target.value)} className="ml-2 p-2 border rounded">
          <option value="general">General</option>
          <option value="report">Report</option>
          <option value="safety">Safety</option>
        </select>
        {audioBlob && (
          <Button onClick={uploadVoiceNote} className="ml-2">
            Upload Voice Note
          </Button>
        )}
      </div>
      <ul>
        {voiceNotes.map((note) => (
          <li key={note.note_id} className="mb-2">
            <audio controls src={`data:audio/webm;base64,${note.voice_note_blob}`} />
            <span className="ml-2">{note.type}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

