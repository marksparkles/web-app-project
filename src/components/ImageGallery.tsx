import React, { useState, useEffect } from 'react';
import { getImages, deleteImage } from '@/services/api';

interface Photo {
  image_data: string;
  image_id: number;
}

interface ImageGalleryProps {
  jobId: number;
  addImage: (data: { job_id: number; type: string; image_data: string }) => Promise<any>;
  type: string;
  fetchOnLoad?: boolean;
  photos: Photo[];
  setPhotos: React.Dispatch<React.SetStateAction<Photo[]>>;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ jobId, addImage, type, fetchOnLoad = true, photos, setPhotos }) => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (fetchOnLoad && jobId && type) {
      fetchJobImages(jobId, type);
    }
  }, [jobId, type, fetchOnLoad]);

  const fetchJobImages = async (jobId: number, type: string) => {
    try {
      const images = await getImages(jobId, type);
      setPhotos(images.map(image => ({
        image_data: image.image_data,
        image_id: image.image_id,
      })));
    } catch (error) {
      console.error('Failed to fetch job images:', error);
      setError('Failed to load job images. Please try again later.');
    }
  };

  const handlePhotoCapture = async () => {
    if (photos.length >= 6) {
      alert('Maximum of 6 images allowed.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      const video = document.createElement('video');
      video.setAttribute('playsinline', 'true');
      video.style.width = '100%';
      video.style.maxWidth = '200px';
      video.style.height = 'auto';
      video.srcObject = stream;
      await video.play();

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      const captureArea = document.getElementById('capture-area');
      if (captureArea) {
        captureArea.innerHTML = '';
        captureArea.appendChild(video);

        const captureButton = document.createElement('button');
        captureButton.innerText = 'Capture Photo';
        captureButton.className = 'btn btn-primary w-100 w-md-auto mt-3';
        captureArea.appendChild(captureButton);

        captureButton.addEventListener('click', async () => {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          context?.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          let dataUrl = canvas.toDataURL('image/jpeg', 0.7);

          stream.getTracks().forEach(track => track.stop());
          captureArea.innerHTML = '';

          try {
            const response = await addImage({ job_id: jobId, type: type, image_data: dataUrl.split(',')[1] });

            if (response.body && response.body.record && response.body.record.image_id) {
              setPhotos((prevPhotos) => [
                ...prevPhotos,
                {
                  image_data: dataUrl,
                  image_id: response.body.record.image_id,
                },
              ]);
            }
          } catch (error) {
            console.error('Failed to save image:', error);
          }
        });
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Could not access camera. Please ensure your device has a camera and permissions are granted.');
    }
  };

  const handlePhotoDelete = async (imageId: number, index: number) => {
    try {
      await deleteImage(imageId);
      setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Failed to delete image:', error);
    }
  };

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <section id="image-gallery" className="mb-4">
      <h2>{`${type.charAt(0).toUpperCase() + type.slice(1)} Images`}</h2>
      <div id="capture-area" className="mb-3"></div>
      <button
        className="btn btn-primary w-100 mb-3"
        onClick={handlePhotoCapture}
        disabled={photos.length >= 6}
      >
        <i className="bi bi-camera-fill me-2"></i>
        Take Photo
      </button>
      <div id="images" className="row g-3">
        {photos.map((photo, index) => (
          <div className="col-4" key={index}>
            <img
              src={photo.image_data || "/placeholder.svg"}
              alt={`${type.charAt(0).toUpperCase() + type.slice(1)} Image ${index + 1}`}
              className="img-fluid border"
            />
            <button
              className="btn btn-danger btn-sm mt-2 w-100"
              onClick={() => handlePhotoDelete(photo.image_id, index)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ImageGallery;

