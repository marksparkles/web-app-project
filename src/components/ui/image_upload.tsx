"use client"
import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"

interface ImageUploadProps {
  jobId: string
}

export default function ImageUpload({ jobId }: ImageUploadProps) {
  const [images, setImages] = useState<Array<{ image_id: string; image_data: string; type: string }>>([])
  const [newImage, setNewImage] = useState<File | null>(null)
  const [imageType, setImageType] = useState<string>("job")
  const [error, setError] = useState<string | null>(null)

  const fetchImages = useCallback(async () => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/images?type=${imageType}`)
      if (!response.ok) throw new Error("Failed to fetch images")
      const data = await response.json()
      setImages(data)
      setError(null)
    } catch (err) {
      console.error("Error fetching images:", err)
      setError("Failed to fetch images. Please try again.")
    }
  }, [jobId, imageType])

  useEffect(() => {
    fetchImages()
  }, [jobId, imageType, fetchImages])

  const handleImageUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newImage) return

    const formData = new FormData()
    formData.append("image", newImage)
    formData.append("type", imageType)

    try {
      const response = await fetch(`/api/jobs/${jobId}/images`, {
        method: "POST",
        body: formData,
      })
      if (!response.ok) throw new Error("Failed to upload image")
      await fetchImages()
      setNewImage(null)
      setError(null)
    } catch (err) {
      console.error("Error uploading image:", err)
      setError("Failed to upload image. Please try again.")
    }
  }

  const handleDeleteImage = async (imageId: string) => {
    try {
      const response = await fetch(`/api/jobs/images/${imageId}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete image")
      await fetchImages()
      setError(null)
    } catch (err) {
      console.error("Error deleting image:", err)
      setError("Failed to delete image. Please try again.")
    }
  }

  return (
    <div className="mt-6">
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <h3 className="text-lg font-semibold mb-2">Images</h3>
      <form onSubmit={handleImageUpload} className="mb-4">
        <Input
          type="file"
          onChange={(e) => setNewImage(e.target.files?.[0] || null)}
          accept="image/*"
          className="mb-2"
        />
        <select value={imageType} onChange={(e) => setImageType(e.target.value)} className="mb-2 p-2 border rounded">
          <option value="job">Job</option>
          <option value="safety">Safety</option>
          <option value="asset">Asset</option>
        </select>
        <Button type="submit">Upload Image</Button>
      </form>
      <div className="grid grid-cols-3 gap-4">
        {images.map((image) => (
          <div key={image.image_id} className="relative">
            <Image
              src={`data:image/jpeg;base64,${image.image_data}`}
              alt={`Job image ${image.image_id}`}
              width={200}
              height={200}
              className="object-cover rounded"
            />
            <Button
              onClick={() => handleDeleteImage(image.image_id)}
              className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded"
            >
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

