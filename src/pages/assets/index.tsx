import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"

interface Asset {
  asset_id: string
  name: string
  category: string
  status: string
}

export default function AssetList() {
  const { data: session } = useSession()
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newAsset, setNewAsset] = useState({ name: "", category: "", status: "" })

  useEffect(() => {
    if (session?.user?.id) {
      fetchAssets()
    }
  }, [session])

  const fetchAssets = async () => {
    try {
      const { data, error } = await supabase.from("assets").select("*").order("name", { ascending: true })

      if (error) throw error

      setAssets(data)
    } catch (error) {
      console.error("Error fetching assets:", error)
      setError("Failed to load assets")
    } finally {
      setLoading(false)
    }
  }

  const addAsset = async () => {
    try {
      const { data, error } = await supabase.from("assets").insert([newAsset]).select()

      if (error) throw error

      setAssets([...assets, data[0]])
      setNewAsset({ name: "", category: "", status: "" })
    } catch (error) {
      console.error("Error adding asset:", error)
      setError("Failed to add asset")
    }
  }

  const deleteAsset = async (assetId: string) => {
    try {
      const { error } = await supabase.from("assets").delete().eq("asset_id", assetId)

      if (error) throw error

      setAssets(assets.filter((asset) => asset.asset_id !== assetId))
    } catch (error) {
      console.error("Error deleting asset:", error)
      setError("Failed to delete asset")
    }
  }

  const exportToCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Asset ID,Name,Category,Status\n" +
      assets.map((asset) => `${asset.asset_id},${asset.name},${asset.category},${asset.status}`).join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "asset_list.csv")
    document.body.appendChild(link)
    link.click()
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Asset List</h1>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Add New Asset</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Name"
              value={newAsset.name}
              onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
            />
            <Input
              placeholder="Category"
              value={newAsset.category}
              onChange={(e) => setNewAsset({ ...newAsset, category: e.target.value })}
            />
            <Input
              placeholder="Status"
              value={newAsset.status}
              onChange={(e) => setNewAsset({ ...newAsset, status: e.target.value })}
            />
            <Button onClick={addAsset}>Add Asset</Button>
          </div>
        </CardContent>
      </Card>
      {assets.map((asset) => (
        <Card key={asset.asset_id} className="mb-2">
          <CardContent className="flex justify-between items-center">
            <div>
              <p>
                <strong>Name:</strong> {asset.name}
              </p>
              <p>
                <strong>Category:</strong> {asset.category}
              </p>
              <p>
                <strong>Status:</strong> {asset.status}
              </p>
            </div>
            <Button variant="destructive" onClick={() => deleteAsset(asset.asset_id)}>
              Delete
            </Button>
          </CardContent>
        </Card>
      ))}
      <Button onClick={exportToCSV} className="mt-4">
        Export to CSV
      </Button>
    </div>
  )
}

