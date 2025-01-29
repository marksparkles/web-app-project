import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface JobOverviewProps {
  jobId: string
  jobCode: string
  description: string
  status: string
  workerName: string
}

export function JobOverviewNew({ jobId, jobCode, description, status, workerName }: JobOverviewProps) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{jobCode}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          <strong>Status:</strong> {status}
        </p>
        <p>
          <strong>Worker:</strong> {workerName}
        </p>
        <p>
          <strong>Description:</strong> {description}
        </p>
        <div className="mt-4 space-x-2">
          <Link href={`/public/jobs/${jobId}/work-update`}>
            <Button>Update Work Progress</Button>
          </Link>
          <Link href={`/public/jobs/${jobId}/asset-survey`}>
            <Button>Scan Asset</Button>
          </Link>
          <Link href={`/public/jobs/${jobId}/safety-report`}>
            <Button>Report Safety Issue</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

