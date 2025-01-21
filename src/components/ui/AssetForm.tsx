import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Textarea } from "../../../components/ui/textarea"
import { Label } from "../../../components/ui/label"

interface AssetFormProps {
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

export default function AssetForm({ jobId }: AssetFormProps) {
  const [asset, setAsset] = useState<AssetDetails>({
    name: "",
    status: "",
    details: {
      category: "",
      asset_condition: "",
      description: "",
      manufacturer: "",
      model: "",
      metadata: [],
    },
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      setError("Failed to load asset details. Please try again.")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
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
      setError("Failed to save asset details. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" value={asset.name} onChange={(e) => setAsset({ ...asset, name: e.target.value })} required />
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Input
          id="status"
          value={asset.status}
          onChange={(e) => setAsset({ ...asset, status: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          value={asset.details.category}
          onChange={(e) => setAsset({ ...asset, details: { ...asset.details, category: e.target.value } })}
          required
        />
      </div>
      <div>
        <Label htmlFor="asset_condition">Condition</Label>
        <Input
          id="asset_condition"
          value={asset.details.asset_condition}
          onChange={(e) => setAsset({ ...asset, details: { ...asset.details, asset_condition: e.target.value } })}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={asset.details.description}
          onChange={(e) => setAsset({ ...asset, details: { ...asset.details, description: e.target.value } })}
          required
        />
      </div>
      <div>
        <Label htmlFor="manufacturer">Manufacturer</Label>
        <Input
          id="manufacturer"
          value={asset.details.manufacturer}
          onChange={(e) => setAsset({ ...asset, details: { ...asset.details, manufacturer: e.target.value } })}
          required
        />
      </div>
      <div>
        <Label htmlFor="model">Model</Label>
        <Input
          id="model"
          value={asset.details.model}
          onChange={(e) => setAsset({ ...asset, details: { ...asset.details, model: e.target.value } })}
          required
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Asset Details"}
      </Button>
    </form>
  )
}

