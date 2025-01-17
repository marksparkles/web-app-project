import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import ImageGallery from '@/components/ImageGallery';
import AssetDetailsSection from '@/components/AssetDetailsSection';
import { addImage, identifyAsset, getAssetDetails } from '@/services/api';

interface AssetDetails {
  name: string;
  category: string;
  asset_condition: string;
  description: string;
  manufacturer: string;
  model: string;
  status: string;
  metadata?: any[];
}

interface Photo {
  image_data: string;
  image_id: number;
}

const AssetScanPage: React.FC = () => {
  const [jobId, setJobId] = useState<number | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [assetDetails, setAssetDetails] = useState<AssetDetails | null>(null);
  const [showUpdateOptions, setShowUpdateOptions] = useState(false);
  const [loadingAssetDetails, setLoadingAssetDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const jobDetailsFromSession = sessionStorage.getItem('jobDetails');
    if (jobDetailsFromSession) {
      const { job_id } = JSON.parse(jobDetailsFromSession);
      setJobId(job_id);
      
      // Fetch existing asset details if available
      (async () => {
        try {
          const response = await getAssetDetails(job_id);
          if (response?.body?.record) {
            const existingAsset = response.body.record;
            setAssetDetails({
              name: existingAsset.name,
              category: existingAsset.details?.category || 'Unknown',
              asset_condition: existingAsset.details?.asset_condition || 'Unknown',
              description: existingAsset.details?.description || 'Unknown',
              manufacturer: existingAsset.details?.manufacturer || 'Unknown',
              model: existingAsset.details?.model || 'Unknown',
              metadata: existingAsset.details?.metadata || [],
              status: existingAsset.status || 'Unknown',
            });
            setShowUpdateOptions(true);
          }
        } catch (err) {
          console.error('Failed to fetch asset details:', err);
        }
      })();
    } else {
      setError('No job details found in session. Please go back to the home page.');
    }
  }, []);

  const handleIdentifyAsset = async () => {
    console.log('Photos length when identifying asset:', photos.length);
    
    if (photos.length === 0) {
      alert('Please add an image before identifying the asset.');
      return;
    }
  
    setLoadingAssetDetails(true);
    
    try {
      if (jobId === null) {
        throw new Error('Job ID is not set');
      }
      let response = await identifyAsset(jobId);

      if (response?.body?.data) {
        const identifiedAsset = response.body.data;
        setAssetDetails({
          name: identifiedAsset.name || 'Unknown',
          category: identifiedAsset.category || 'Unknown',
          asset_condition: identifiedAsset.asset_condition || 'Condition not available',
          description: identifiedAsset.description || 'Description not available',
          manufacturer: identifiedAsset.manufacturer || 'Unknown',
          model: identifiedAsset.model || 'Unknown',
          metadata: identifiedAsset.metadata || [],
          status: 'Identified', // Default status after identification
        });
        setShowUpdateOptions(true);
      } 
    } catch (error) {
      console.error('Error identifying asset:', error);
    } finally {
      setLoadingAssetDetails(false);
    }
  };
  
  if (error) {
    return (
      <div className="text-center my-5">
        <i className="bi bi-exclamation-triangle-fill text-danger" style={{ fontSize: '3rem' }}></i>
        <h2 className="mt-3">Oops! {error}</h2>
        <p className="lead">Please check the link or contact your supervisor for assistance.</p>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '0px' }}>
      <Header title="Asset Scanner" style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000, backgroundColor: '#007bff', color: '#fff' }} />

      {/* Main Content */}
      <main className="container-fluid my-4 px-3" style={{ paddingBottom: '120px', overflowY: 'auto', height: 'calc(100vh - 160px)' }}>  
        {/* Image Gallery Section */}
        <ImageGallery
          jobId={jobId || 0}
          addImage={addImage}
          type="asset"
          fetchOnLoad={true}
          photos={photos}
          setPhotos={setPhotos}
        />

      {/* Identify Asset and Update Asset Section */}
      <AssetDetailsSection
        photos={photos}
        assetDetails={assetDetails}
        setAssetDetails={setAssetDetails}
        loadingAssetDetails={loadingAssetDetails}
        handleIdentifyAsset={handleIdentifyAsset}
        showUpdateOptions={showUpdateOptions}
        setShowUpdateOptions={setShowUpdateOptions}
        jobId={jobId || 0}
      />

      </main>

      {/* Bottom Navigation Bar */}
      <BottomNav activePage="asset-scan" style={{ position: 'fixed', bottom: 0, width: '100%', zIndex: 1000 }} />
    </div>
  );
};

export default AssetScanPage;

