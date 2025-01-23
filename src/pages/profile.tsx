import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface Usage {
  jobsUsed: number
  jobsLimit: number
  assetScansUsed: number
  assetScansLimit: number
  aiSummariesUsed: number
  aiSummariesLimit: number
}

export default function Profile() {
  const { data: session } = useSession()
  const [usage, setUsage] = useState<Usage | null>(null)

  useEffect(() => {
    if (session?.user?.id) {
      fetchUsage(session.user.id)
    }
  }, [session])

  const fetchUsage = async (userId: string) => {
    const { data, error } = await supabase.from("user_usage").select("*").eq("user_id", userId).single()

    if (error) {
      console.error("Error fetching usage:", error)
    } else {
      setUsage(data)
    }
  }

  if (!session) {
    return <div>Please sign in to view your profile.</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>Usage Limits</CardTitle>
        </CardHeader>
        <CardContent>
          {usage ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Jobs</h3>
                <Progress value={(usage.jobsUsed / usage.jobsLimit) * 100} />
                <p>
                  {usage.jobsUsed} / {usage.jobsLimit}
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Asset Scans</h3>
                <Progress value={(usage.assetScansUsed / usage.assetScansLimit) * 100} />
                <p>
                  {usage.assetScansUsed} / {usage.assetScansLimit}
                </p>
              </div>
              <div>
                <h3 className="font-semibold">AI Summaries</h3>
                <Progress value={(usage.aiSummariesUsed / usage.aiSummariesLimit) * 100} />
                <p>
                  {usage.aiSummariesUsed} / {usage.aiSummariesLimit}
                </p>
              </div>
            </div>
          ) : (
            <p>Loading usage data...</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

