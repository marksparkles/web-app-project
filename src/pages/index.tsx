import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Header from "@/components/common/Header"
import BottomNav from "@/components/BottomNav"

interface Job {
  job_id: number
  job_code: string
  description: string
  status: string
}

const HomePage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const response = await fetch("/api/jobs")
      if (!response.ok) throw new Error("Failed to fetch jobs")
      const data = await response.json()
      setJobs(data)
      setLoading(false)
    } catch (err) {
      console.error("Error fetching jobs:", err)
      setError("Failed to load jobs. Please try again.")
      setLoading(false)
    }
  }

  const handleJobClick = (job: Job) => {
    sessionStorage.setItem("jobDetails", JSON.stringify(job))
    router.push(`/jobs/${job.job_id}`)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div>
      <Header title="Job List" />
      <main className="container mt-4">
        <ul className="list-group">
          {jobs.map((job) => (
            <li key={job.job_id} className="list-group-item list-group-item-action" onClick={() => handleJobClick(job)}>
              <h5>{job.job_code}</h5>
              <p>{job.description}</p>
              <span className={`badge ${job.status === "completed" ? "bg-success" : "bg-warning"}`}>{job.status}</span>
            </li>
          ))}
        </ul>
      </main>
      <BottomNav activePage="home" />
    </div>
  )
}

export default HomePage

