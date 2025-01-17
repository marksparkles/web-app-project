import axios from 'axios';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
const API_BASE_URL = 'https://api-dev.app-aegis.com';


// Job-related API calls
export const getJobDetailsByCode = async (jobCode: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/db`, {
      action: {
        organisation_id: '1234',
        operation: 'get_job_by_code',
        job_code: jobCode
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching job details:', error);
    throw error;
  }
};

export const getJobDetails = async (jobId: number) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/db`, {
      action: {
        operation: 'get_job_details_by_id',
        job_id: jobId
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching job details:', error);
    throw error;
  }
};


// Image-related API calls
export const getImages = async (jobId: number, type: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/db`, {
      action: {
        operation: 'get_images',
        job_id: jobId,
        type: type
      }
    });
    return response.data.body.records || [];
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
};

export const addImage = async (data: { job_id: number; type: string; image_data: string }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/db`, {
      action: {
        operation: 'add_image',
        ...data
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error adding image:', error);
    throw error;
  }
};

export const deleteImage = async (imageId: number) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/db`, {
      action: {
        operation: 'delete_image',
        image_id: imageId
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

// Asset-related API calls
export const identifyAsset = async (jobId: number) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/db`, {
      action: {
        operation: 'identify_asset',
        job_id: jobId
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error identifying asset:', error);
    throw error;
  }
};

export const getAssetDetails = async (jobId: number) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/db`, {
      action: {
        operation: 'get_asset_details',
        job_id: jobId
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching asset details:', error);
    throw error;
  }
};

export const insertAssetDetails = async (
  jobId: number,
  name: string,
  status: string,
  details: any
) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/db`, {
      action: {
        operation: 'insert_asset_details',
        job_id: jobId,
        name: name,
        status: status,
        details: details
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error inserting asset details:', error);
    throw error;
  }
};

// Voice note-related API calls
export const getVoiceNotes = async (jobId: number, type: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/db`, {
      action: {
        operation: 'get_voice_notes',
        job_id: jobId,
        type: type
      }
    });
    return response.data.body.records || [];
  } catch (error) {
    console.error('Error fetching voice notes:', error);
    throw error;
  }
};

// Safety report-related API calls
export const addSafetyReport = async (data: { job_id: number | null; description: string }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/db`, {
      action: {
        operation: 'add_safety_report',
        ...data
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error adding safety report:', error);
    throw error;
  }
};

