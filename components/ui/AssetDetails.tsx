import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface AssetDetailsProps {
  jobId: string
}

interface AssetDetails {
  asset_id?: string
  name: string
  status: string
  details: {
    category: string
    asset_condition: string
    description: string
    manufacturer: string
    model: string
    metadata: string[]
  }
}

export function AssetDetails({ jobId }: AssetDetailsProps) {
  const [asset, setAsset] = useState<AssetDetails | null>(null)

  useEffect(() => {
    fetchAssetDetails()
  }, [jobId])

  const fetchAssetDetails = async () => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/assets`)
      if (!response.ok) throw new Error("Failed to fetch asset details")
      const data = await response.json()
      setAsset(data)
    } catch (err) {
      console.error("Error fetching asset details:", err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!asset) return

    try {
      const response = await fetch(`/api/jobs/${jobId}/assets`, {
        method: asset.asset_id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(asset),
      })
      if (!response.ok) throw new Error("Failed to save asset details")
      const data = await response.json()
      setAsset(data.asset)
      alert("Asset details saved successfully")
    } catch (err) {
      console.error("Error saving asset details:", err)
    }
  }

  if (!asset) return <div>Loading asset details...</div>

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Asset Details</h3>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <div>
            <label htmlFor="name">Name</label>
            <Input
              id="name"
              value={asset.name}
              onChange={(e) => setAsset({ ...asset, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="status">Status</label>
            <Input
              id="status"
              value={asset.status}
              onChange={(e) => setAsset({ ...asset, status: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="category">Category</label>
            <Input
              id="category"
              value={asset.details.category}
              onChange={(e) => setAsset({ ...asset, details: { ...asset.details, category: e.target.value } })}
              required
            />
          </div>
          <div>
            <label htmlFor="asset_condition">Condition</label>
            <Input
              id="asset_condition"
              value={asset.details.asset_condition}
              onChange={(e) => setAsset({ ...asset, details: { ...asset.details, asset_condition: e.target.value } })}
              required
            />
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <Textarea
              id="description"
              value={asset.details.description}
              onChange={(e) => setAsset({ ...asset, details: { ...asset.details, description: e.target.value } })}
              required
            />
          </div>
          <div>
            <label htmlFor="manufacturer">Manufacturer</label>
            <Input
              id="manufacturer"
              value={asset.details.manufacturer}
              onChange={(e) => setAsset({ ...asset, details: { ...asset.details, manufacturer: e.target.value } })}
              required
            />
          </div>
          <div>
            <label htmlFor="model">Model</label>
            <Input
              id="model"
              value={asset.details.model}
              onChange={(e) => setAsset({ ...asset, details: { ...asset.details, model: e.target.value } })}
              required
            />
          </div>
        </div>
        <Button type="submit" className="mt-4">
          Save Asset Details
        </Button>
      </form>
    </div>
  )
}

