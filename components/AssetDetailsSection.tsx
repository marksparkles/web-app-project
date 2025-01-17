import React, { useState } from 'react';
import { insertAssetDetails } from '../services/api';

interface AssetDetails {
  name: string;
  category: string;
  asset_condition: string;
  description: string;
  manufacturer: string;
  model: string;
  status?: string;
  metadata?: any;
}

interface AssetDetailsSectionProps {
  photos: any[];
  assetDetails: AssetDetails | null;
  setAssetDetails: React.Dispatch<React.SetStateAction<AssetDetails | null>>;
  loadingAssetDetails: boolean;
  handleIdentifyAsset: () => void;
  showUpdateOptions: boolean;
  setShowUpdateOptions: React.Dispatch<React.SetStateAction<boolean>>;
  jobId: number;
}

const AssetDetailsSection: React.FC<AssetDetailsSectionProps> = ({
  photos,
  assetDetails,
  setAssetDetails,
  loadingAssetDetails,
  handleIdentifyAsset,
  showUpdateOptions,
  setShowUpdateOptions,
  jobId,
}) => {
  const [assetStatus, setAssetStatus] = useState('');

  const handleInsertAssetDetails = async () => {
    if (!assetDetails) {
      alert('No asset details found to update.');
      return;
    }
  
    if (!jobId) {
      alert('Job ID is missing. Cannot update asset details.');
      return;
    }
  
    try {
      const details = {
        category: assetDetails.category,
        asset_condition: assetDetails.asset_condition,
        description: assetDetails.description,
        manufacturer: assetDetails.manufacturer,
        model: assetDetails.model,
        metadata: assetDetails.metadata,
      };
  
      await insertAssetDetails(jobId, assetDetails.name, assetStatus || assetDetails.status || '', details);
       
      setAssetDetails({
        ...assetDetails,
        status: assetStatus || assetDetails.status,
      });
    } catch (error) {
      console.error('Failed to insert asset details:', error);
    }
  };

  return (
    <>
      {photos.length > 0 && (
        <button id="identify-asset-button" className="btn btn-primary w-100 mb-4" onClick={handleIdentifyAsset} disabled={loadingAssetDetails}>
          {loadingAssetDetails ? 'Identifying...' : 'Identify Asset'}
        </button>
      )}

      {assetDetails && !loadingAssetDetails && (
        <section id="asset-details" className="mb-4">
          <h2>Asset Details</h2>
          <ul className="list-group">
            <li className="list-group-item">
              <label><strong>Name:</strong></label>
              <input
                type="text"
                className="form-control"
                value={assetDetails.name}
                onChange={(e) => setAssetDetails({ ...assetDetails, name: e.target.value })}
              />
            </li>
            <li className="list-group-item">
              <label><strong>Category:</strong></label>
              <input
                type="text"
                className="form-control"
                value={assetDetails.category}
                onChange={(e) => setAssetDetails({ ...assetDetails, category: e.target.value })}
              />
            </li>
            <li className="list-group-item">
              <label><strong>Condition:</strong></label>
              <input
                type="text"
                className="form-control"
                value={assetDetails.asset_condition}
                onChange={(e) => setAssetDetails({ ...assetDetails, asset_condition: e.target.value })}
              />
            </li>
            <li className="list-group-item">
              <label><strong>Description:</strong></label>
              <textarea
                className="form-control"
                value={assetDetails.description}
                onChange={(e) => setAssetDetails({ ...assetDetails, description: e.target.value })}
              />
            </li>
            <li className="list-group-item">
              <label><strong>Manufacturer:</strong></label>
              <input
                type="text"
                className="form-control"
                value={assetDetails.manufacturer}
                onChange={(e) => setAssetDetails({ ...assetDetails, manufacturer: e.target.value })}
              />
            </li>
            <li className="list-group-item">
              <label><strong>Model:</strong></label>
              <input
                type="text"
                className="form-control"
                value={assetDetails.model}
                onChange={(e) => setAssetDetails({ ...assetDetails, model: e.target.value })}
              />
            </li>
          </ul>
        </section>
      )}

      {showUpdateOptions && (
        <section id="update-status" className="mb-4">
          <h2>Update Asset Status</h2>
          <div className="btn-group w-100" role="group" aria-label="Asset Status">
            <input type="radio" className="btn-check" name="assetStatus" id="statusInstalled" value="Installed" onChange={(e) => setAssetStatus(e.target.value)} autoComplete="off" />
            <label className="btn btn-outline-primary" htmlFor="statusInstalled">Installed</label>

            <input type="radio" className="btn-check" name="assetStatus" id="statusServiced" value="Serviced" onChange={(e) => setAssetStatus(e.target.value)} autoComplete="off" />
            <label className="btn btn-outline-primary" htmlFor="statusServiced">Serviced</label>

            <input type="radio" className="btn-check" name="assetStatus" id="statusNeedsRepair" value="Needs Repair" onChange={(e) => setAssetStatus(e.target.value)} autoComplete="off" />
            <label className="btn btn-outline-primary" htmlFor="statusNeedsRepair">Needs Repair</label>
          </div>
        </section>
      )}

      {showUpdateOptions && (
        <button id="update-asset-button" className="btn btn-success w-100" onClick={handleInsertAssetDetails}>
          Update Asset
        </button>
      )}
    </>
  );
};

export default AssetDetailsSection;

