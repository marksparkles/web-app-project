import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"

export default function AssetSurvey() {
  const router = useRouter()
  const { jobId } = router.query
  const [job, setJob] = useState(null)
  const [assetDetails, setAssetDetails] = useState({
    name: "",
    category: "",
    condition: "",
  })

  useEffect(() => {
    if (jobId) {
      fetchJobDetails()
    }
  }, [jobId])

  const fetchJobDetails = async () => {
    const { data, error } = await supabase.from("jobs").select("*").eq("job_id", jobId).single()

    if (error) console.error("Error fetching job:", error)
    else setJob(data)
  }

  const submitAssetSurvey = async () => {
    const { data, error } = await supabase.from("assets").insert({ ...assetDetails, job_id: jobId })

    if (error) console.error("Error submitting asset survey:", error)
    else {
      alert("Asset survey submitted successfully")
      setAssetDetails({ name: "", category: "", condition: "" })
    }
  }

  if (!job) return <div>Loading...</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset Survey for Job: {job.job_code}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Asset Name</Label>
            <Input
              id="name"
              value={assetDetails.name}
              onChange={(e) => setAssetDetails({ ...assetDetails, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={assetDetails.category}
              onChange={(e) => setAssetDetails({ ...assetDetails, category: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="condition">Condition</Label>
            <Input
              id="condition"
              value={assetDetails.condition}
              onChange={(e) => setAssetDetails({ ...assetDetails, condition: e.target.value })}
            />
          </div>
          <Button onClick={submitAssetSurvey}>Submit Asset Survey</Button>
        </div>
      </CardContent>
    </Card>
  )
}

