"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

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

export default function AssetDetails({ jobId }: AssetDetailsProps) {
  const [asset, setAsset] = useState<AssetDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAssetDetails = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/jobs/${jobId}/assets`)
      if (!response.ok) throw new Error("Failed to fetch asset details")
      const data = await response.json()
      setAsset(data)
    } catch (err) {
      console.error("Error fetching asset details:", err)
      setError("Failed to load asset details. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }, [jobId])

  useEffect(() => {
    fetchAssetDetails()
  }, [fetchAssetDetails])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!asset) return

    setIsLoading(true)
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
      setIsLoading(false)
    }
  }

  if (isLoading) return <div>Loading asset details...</div>
  if (error) return <div>Error: {error}</div>
  if (!asset) return <div>No asset details found</div>

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Asset Details</h3>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={asset.name}
              onChange={(e) => setAsset({ ...asset, name: e.target.value })}
              required
            />
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
        </div>
        <Button type="submit" className="mt-4" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Asset Details"}
        </Button>
      </form>
    </div>
  )
}

