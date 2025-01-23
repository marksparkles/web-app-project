import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function TradesmanDashboard({ jobs }: { jobs: any[] }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tradesman Dashboard</h1>
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
        <Card key={job.job_id}>
          <CardHeader>
            <CardTitle>{job.job_code}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Status:</strong> {job.status}
            </p>
            <p>
              <strong>Description:</strong> {job.description}
            </p>
            <Link href={`/jobs/${job.job_id}`}>
              <Button className="mt-2">View Details</Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

