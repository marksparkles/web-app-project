import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/common/Header';
import BottomNav from '@/components/BottomNav';
import VoiceNoteRecorder from '@/components/VoiceNoteRecorder';
import ImageGallery from '@/components/ImageGallery';
import SafetyDescription from '@/components/SafetyDescription';
import { addImage, addSafetyReport } from '@/services/api';

interface JobDetails {
  job_id: number;
}

interface Photo {
  image_data: string;
  image_id: number;
}

const SafetyReportPage: React.FC = () => {
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const jobDetailsFromSession = sessionStorage.getItem('jobDetails');
    if (jobDetailsFromSession) {
      const jobDetailsParsed = JSON.parse(jobDetailsFromSession);
      setJobDetails(jobDetailsParsed);
    } else {
      setError('No job details found in session. Please go back to the home page.');
    }
  }, []);

  const handleSubmit = async () => {
    if (!description) {
      alert('Description is required to submit the safety report.');
      return;
    }
    if (photos.length === 0) {
      alert('At least one photo is required to submit the safety report.');
      return;
    }

    setIsSubmitting(true);

    try {
      await addSafetyReport({
        job_id: jobDetails?.job_id || null,
        description,
      });
      router.push('/');
    } catch (error) {
      console.error('Failed to submit safety report:', error);
    } finally {
      setIsSubmitting(false);
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

  if (!jobDetails) {
    return (
      <div className="text-center my-5">
        <i className="bi bi-arrow-repeat" style={{ fontSize: '3rem' }}></i>
        <h2 className="mt-3">Loading...</h2>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '0px' }}>
      <Header title="Safety Snap Report" style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000, backgroundColor: '#007bff', color: '#fff' }} />

      <main className="container-fluid my-4 px-3" style={{ paddingBottom: '120px', overflowY: 'auto', height: 'calc(100vh - 160px)' }}>
        {/* Image Gallery Section */}
        <ImageGallery 
          jobId={jobDetails?.job_id} 
          addImage={addImage} 
          type='safety' 
          fetchOnLoad={false} 
          photos={photos}
          setPhotos={setPhotos}
        />

        {/* Description Field */}
        <SafetyDescription description={description} setDescription={setDescription} />

        {/* Voice Note Option */}
        <VoiceNoteRecorder jobId={jobDetails?.job_id} type='safety' />

        {/* Submit Button */}
        <button
          className="btn btn-success w-100"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </button>
      </main>

      <BottomNav activePage="safety-report" style={{ position: 'fixed', bottom: 0, width: '100%', zIndex: 1000 }} />
    </div>
  );
};

export default SafetyReportPage;

