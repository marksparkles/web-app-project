import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AdminDashboard({ jobs, users, assets }: { jobs: any[]; users: any[]; assets: any[] }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{jobs.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{users.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{assets.length}</p>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Recent Jobs</h2>
        <Link href="/admin/jobs">
          <Button>Manage Jobs</Button>
        </Link>
      </div>
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
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">User Management</h2>
        <Link href="/admin/users">
          <Button>Manage Users</Button>
        </Link>
      </div>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Asset Management</h2>
        <Link href="/assets">
          <Button>Manage Assets</Button>
        </Link>
      </div>
    </div>
  )
}

