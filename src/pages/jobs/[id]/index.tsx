import { useRouter } from "next/router"
import JobOverview from "@/components/ui/JobOverview"

export default function JobPage() {
  const router = useRouter()
  const { id } = router.query

  if (!id || typeof id !== "string") {
    return <div>Invalid job ID</div>
  }

  return <JobOverview jobId={id} />
}

