import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = 'https://api-dev.app-aegis.com';
const WEBSITE_BASE_URL = 'https://www.app-aegis.com';

// Function to handle errors and display alert
const handleApiError = (error: any, errorMessage: string): never => {
  console.error(errorMessage, error);
  alert(errorMessage);
  throw error;
};

interface ApiResponse<T = any> {
  statusCode: number;
  body: {
    error?: string;
    record?: T;
    data?: T;
  };
}

// Example: Handle getJobDetailsByCode API call
export const getJobDetailsByCode = async (jobCode: string): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await axios.post(`${API_BASE_URL}/db`, {
      action: {
        organisation_id: '1234',
        operation: 'get_job_by_code',
        job_code: jobCode,
      },
    });
    if (response.data?.statusCode !== 200 || response.data?.body?.error) {
      throw new Error(response.data.body?.error || 'Unknown error occurred while fetching job details by code.');
    }
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Error fetching job details. Please try again later.');
  }
};

// Example: Handle getJobDetails API call
export const getJobDetails = async (jobId: number): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await axios.post(`${API_BASE_URL}/db`, {
      action: {
        organisation_id: '1234',
        operation: 'get_job',
        job_id: jobId,
      },
    });
    if (response.data?.statusCode !== 200 || response.data?.body?.error) {
      throw new Error(response.data.body?.error || 'Unknown error occurred while fetching job details.');
    }
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Error fetching job details. Please try again later.');
  }
};

// Example: Handle getVoiceNotes API call
export const getVoiceNotes = async (jobId: number, type: string): Promise<any[]> => {
  try {
    const response: AxiosResponse<ApiResponse> = await axios.post(`${API_BASE_URL}/db`, {
      action: {
        operation: 'get_voice_notes',
        job_id: jobId,
        type: type,
      },
    });
    if (response.data?.statusCode !== 200 || response.data?.body?.error) {
      throw new Error(response.data.body?.error || 'Unknown error occurred while fetching voice notes.');
    }
    return response.data.body.record || [];
  } catch (error) {
    return handleApiError(error, 'Error fetching voice notes. Please try again later.');
  }
};

// Example: Handle addVoiceNote API call
export const addVoiceNote = async (jobId: number, voiceNoteData: string): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await axios.post(`${API_BASE_URL}/db`, {
      action: {
        operation: 'add_voice_note',
        job_id: jobId,
        voice_note_data: voiceNoteData,
      },
    });
    if (response.data?.statusCode !== 200 || response.data?.body?.error) {
      throw new Error(response.data.body?.error || 'Unknown error occurred while adding voice note.');
    }
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Error adding voice note. Please try again later.');
  }
};

// Example: Handle identifyAsset API call
export const identifyAsset = async (jobId: number): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await axios.post(`${API_BASE_URL}/ai`, {
      action: {
        operation: 'identify_asset',
        job_id: jobId,
        organisation_id: 'hard coded', // Replace with the appropriate organisation_id or make it dynamic if needed
      },
    });
    if (response.data?.statusCode !== 200 || response.data?.body?.error) {
      throw new Error(response.data.body?.error || 'Unknown error occurred while identifying asset.');
    }
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to identify asset. Please try again later.');
  }
};

export const jobSummary = async (jobId: number, description: string): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await axios.post(`${API_BASE_URL}/ai`, {
      action: {
        operation: 'job_summary',
        job_id: jobId,
        text: description,
        organisation_id: 'hard coded', // Replace with the appropriate organisation_id or make it dynamic if needed
      },
    });
    if (response.data?.statusCode !== 200 || response.data?.body?.error) {
      throw new Error(response.data.body?.error || 'Unknown error occurred while obtaining job summary.');
    }
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to get job summary. Please try again later.');
  }
};

// Example: Handle getAssetDetails API call
export const getAssetDetails = async (jobId: number): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await axios.post(`${API_BASE_URL}/db`, {
      action: {
        operation: 'get_asset_details',
        job_id: jobId,
      },
    });
    if (response.data?.statusCode !== 200 || response.data?.body?.error) {
      throw new Error(response.data.body?.error || 'Unknown error occurred while fetching asset details.');
    }
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Error fetching asset details. Please try again later.');
  }
};

// Example: Handle insertAssetDetails API call
export const insertAssetDetails = async (jobId: number, name: string, status: string, details: any): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await axios.post(`${API_BASE_URL}/db`, {
      action: {
        operation: 'insert_asset_details',
        job_id: jobId,
        name: name,
        status: status,
        details: details,
      },
    });
    if (response.data?.statusCode !== 200 || response.data?.body?.error) {
      throw new Error(response.data.body?.error || 'Unknown error occurred while inserting asset details.');
    }
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Error inserting asset details. Please try again later.');
  }
};

interface UpdateJobData {
  job_id: number;
  summary: string;
  is_reviewed_accurate: number;
  status: string;
}

// Example: Handle updateJobDetails API call
export const updateJobDetails = async (data: UpdateJobData): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await axios.post(`${API_BASE_URL}/db`, {
      action: {
        operation: 'update_job',
        job_id: data.job_id,
        summary: data.summary,
        is_reviewed_accurate: data.is_reviewed_accurate,
        status: data.status,
      },
    });
    if (response.data?.statusCode !== 200 || response.data?.body?.error) {
      throw new Error(response.data.body?.error || 'Unknown error occurred while updating job details.');
    }
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Error updating job details. Please try again later.');
  }
};

interface Image {
  image_id: number;
  image_data: string;
}

// Example: Handle getImages API call
export const getImages = async (jobId: number, type: string): Promise<Image[]> => {
  try {
    const response: AxiosResponse<ApiResponse> = await axios.post(`${API_BASE_URL}/db`, {
      action: {
        operation: 'get_images',
        job_id: jobId,
        type: type,
      },
    });
    if (response.data?.statusCode !== 200 || response.data?.body?.error) {
      throw new Error(response.data.body?.error || 'Unknown error occurred while fetching images.');
    }
    const images = response.data.body.record;
    if (Array.isArray(images)) {
      return images.map((image) => ({
        ...image,
        image_data: `data:image/png;base64,${image.image_data}`,
      }));
    }
    return [];
  } catch (error) {
    return handleApiError(error, 'Error fetching images. Please try again later.');
  }
};

interface AddImageData {
  job_id: number;
  image_data: string;
  type: string;
}

// Example: Handle addImage API call
export const addImage = async (data: AddImageData): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await axios.post(`${API_BASE_URL}/db`, {
      action: {
        operation: 'add_image',
        job_id: data.job_id,
        image_data: data.image_data,
        type: data.type,
      },
    });
    if (response.data?.statusCode !== 200 || response.data?.body?.error) {
      throw new Error(response.data.body?.error || 'Unknown error occurred while adding image.');
    }
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Error adding image. Please try again later.');
  }
};

export const deleteImage = async (imageId: number): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await axios.post(`${API_BASE_URL}/db`, {
      action: {
        operation: 'delete_image',
        image_id: imageId,
      },
    });
    if (response.data?.statusCode !== 200 || response.data?.body?.error) {
      throw new Error(response.data.body?.error || 'Unknown error occurred while deleting image.');
    }
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Error deleting image. Please try again later.');
  }
};

interface SafetyReportData {
  job_id: number | null;
  description: string;
}

// Example: Handle addSafetyReport API call
export const addSafetyReport = async (data: SafetyReportData): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await axios.post(`${API_BASE_URL}/db`, {
      action: {
        operation: 'add_safety_report',
        job_id: data.job_id,
        description: data.description,
      },
    });
    if (response.data?.statusCode !== 200 || response.data?.body?.error) {
      throw new Error(response.data.body?.error || 'Unknown error occurred while adding safety report.');
    }
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Error adding safety report. Please try again later.');
  }
};

export default {
  getJobDetailsByCode,
  getJobDetails,
  getVoiceNotes,
  addVoiceNote,
  identifyAsset,
  getAssetDetails,
  insertAssetDetails,
  updateJobDetails,
  getImages,
  addImage,
  deleteImage,
  addSafetyReport,
};

