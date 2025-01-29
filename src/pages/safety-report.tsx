import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabase"

export default function SafetyReport() {
  const router = useRouter()
  const { jobId } = router.query
  const [job, setJob] = useState(null)
  const [report, setReport] = useState("")

  useEffect(() => {
    if (jobId) {
      fetchJobDetails()
    }
  }, [jobId])

  const fetchJobDetails = async () => {
    const { data, error } = await supabase.from("jobs").select("*").eq("job_id", jobId).single()

    if (error) console.error("Error fetching job:", error)
    else setJob(data)
  }

  const submitSafetyReport = async () => {
    const { data, error } = await supabase.from("safety_reports").insert({ job_id: jobId, report_text: report })

    if (error) console.error("Error submitting safety report:", error)
    else {
      alert("Safety report submitted successfully")
      setReport("")
    }
  }

  if (!job) return <div>Loading...</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Safety Report for Job: {job.job_code}</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={report}
          onChange={(e) => setReport(e.target.value)}
          placeholder="Describe the safety issue here..."
          className="mb-4"
        />
        <Button onClick={submitSafetyReport}>Submit Safety Report</Button>
      </CardContent>
    </Card>
  )
}

