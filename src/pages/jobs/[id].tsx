import { useRouter } from "next/router"
import { JobDetails } from "@/components/ui/job-details"

export default function JobPage() {
  const router = useRouter()
  const { id } = router.query

  if (!id || typeof id !== "string") {
    return <div>Invalid job ID</div>
  }

  return <JobDetails jobId={id} />
}

