import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import JobDetails from "@/components/ui/JobDetails"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Error } from "@/components/ui/Error"
import { Loading } from "@/components/ui/Loading"

export default function JobPage() {
  const router = useRouter()
  const { id } = router.query
  const { data: session } = useSession()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (id) {
      fetchJobDetails()
    }
  }, [id])

  const fetchJobDetails = async () => {
    try {
      const { data, error } = await supabase.from("jobs").select("*").eq("job_id", id).single()

      if (error) throw error

      setJob(data)
    } catch (err) {
      setError("Failed to fetch job details")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} />
  if (!job) return <Error message="No job found" />

  return <JobDetails job={job} session={session} />
}

