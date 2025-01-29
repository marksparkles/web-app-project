import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import JobOverview from "@/components/ui/JobOverview"
import { JobOverviewNew } from "@/components/ui/JobOverviewNew"

export default function TradesmanDashboard({ jobs }: { jobs: any[] }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Job Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Active Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{jobs.filter((job) => job.status !== "completed").length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Completed Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{jobs.filter((job) => job.status === "completed").length}</p>
          </CardContent>
        </Card>
      </div>
      <h2 className="text-xl font-semibold mt-6 mb-4">Recent Jobs</h2>
      {jobs.slice(0, 5).map((job) => (
        <JobOverviewNew key={job.job_id} jobId={job.job_id} />
      ))}
    </div>
  )
}

