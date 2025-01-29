import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface JobDetailsProps {
  jobCode: string
  description: string
  status: string
  clientName: string
  location: string
  startDate: string
  endDate: string
}

export function JobDetails({
  jobCode,
  description,
  status,
  clientName,
  location,
  startDate,
  endDate,
}: JobDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Details: {jobCode}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          <strong>Description:</strong> {description}
        </p>
        <p>
          <strong>Status:</strong> {status}
        </p>
        <p>
          <strong>Client:</strong> {clientName}
        </p>
        <p>
          <strong>Location:</strong> {location}
        </p>
        <p>
          <strong>Start Date:</strong> {startDate}
        </p>
        <p>
          <strong>End Date:</strong> {endDate}
        </p>
      </CardContent>
    </Card>
  )
}

