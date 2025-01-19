import React from 'react';
import { updateJobDetails } from '../services/api';

interface JobDetails {
  job_id: number;
  status: string;
}

interface ActionButtonsProps {
  jobDetails: JobDetails | null;
  summaryText: string;
  isSignedOff: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ jobDetails, summaryText, isSignedOff }) => {
  const handleSaveDraft = async () => {
    if (!jobDetails) {
      return;
    }
    const updatedJobData = {
      job_id: jobDetails.job_id,
      summary: summaryText,
      is_reviewed_accurate: isSignedOff ? 1 : 0,
      status: jobDetails.status
    };

    try {
      await updateJobDetails(updatedJobData);
      alert('Draft saved successfully!');
    } catch (error) {
      console.error('Failed to save draft:', error);
      alert('Failed to save draft. Please try again.');
    }
  };

  const handleSubmitReport = async () => {
    if (!jobDetails) {
      return;
    }
    if (isSignedOff) {
      const updatedJobData = {
        job_id: jobDetails.job_id,
        summary: summaryText,
        is_reviewed_accurate: 1,
        status: 'submitted',
      };

      try {
        await updateJobDetails(updatedJobData);
        alert('Report submitted successfully!');
        window.location.href = '/';
      } catch (error) {
        console.error('Failed to submit report:', error);
        alert('Failed to submit report. Please try again.');
      }
    } else {
      alert('Please confirm the report is accurate by checking the sign-off box.');
    }
  };

  return (
    <div id="action-buttons" className="d-flex gap-3">
      <button id="save-draft-button" className="btn btn-secondary flex-fill" onClick={handleSaveDraft}>Save Draft</button>
      <button id="submit-report-button" className="btn btn-success flex-fill" onClick={handleSubmitReport}>Submit Report</button>
    </div>
  );
};

export default ActionButtons;

