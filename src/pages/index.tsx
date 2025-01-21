import { useState, useEffect } from "react"
import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import BottomNav from "@/components/BottomNav"

interface Job {
  job_id: string
  job_code: string
  status: string
}

export default function JobList() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("/api/jobs")
        if (!response.ok) throw new Error("Failed to fetch jobs")
        const data = await response.json()
        setJobs(data)
      } catch (err) {
        console.error("Error fetching jobs:", err)
        setError("Failed to load jobs")
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between bg-blue-600 px-4">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-white rounded" />
          <h1 className="ml-4 text-xl font-semibold text-white">Job List</h1>
        </div>
        <Button variant="ghost" size="icon" className="text-white">
          <Settings className="h-5 w-5" />
        </Button>
      </header>

      <main className="flex-1 p-4">
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li
              key={job.job_id}
              className="p-4 bg-white rounded-lg shadow cursor-pointer"
              onClick={() => {
                sessionStorage.setItem("jobDetails", JSON.stringify(job))
                window.location.href = `/jobs/${job.job_id}`
              }}
            >
              <div className="flex flex-col gap-2">
                <span className="text-lg font-medium">{job.job_code}</span>
                <Badge variant="outline" className="w-fit bg-yellow-100 text-yellow-800 border-yellow-300">
                  {job.status}
                </Badge>
              </div>
            </li>
          ))}
        </ul>
      </main>

      <BottomNav activePage="home" />
    </div>
  )
}

