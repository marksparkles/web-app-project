import React, { useEffect, useState } from 'react';
import Header from '@/components/common/Header';
import BottomNav from '@/components/BottomNav';
import VoiceNoteRecorder from '@/components/VoiceNoteRecorder';
import { addImage, getJobDetails, getVoiceNotes } from '@/services/api';
import ImageGallery from '@/components/ImageGallery';
import SummarySection from '@/components/SummarySection';
import SignOffCheckbox from '@/components/SignOffCheckbox';
import ActionButtons from '@/components/ActionButtons';

interface JobDetails {
  job_id: number;
  summary: string;
  is_reviewed_accurate: number;
}

interface VoiceNote {
  note_id: number;
  voice_note_blob: string;
  created_at: string;
}

interface Photo {
  image_data: string;
  image_id: number;
}

const WorkUpdatesPage: React.FC = () => {
  const [summaryLength, setSummaryLength] = useState('3');
  const [summaryText, setSummaryText] = useState('');
  const [isSignedOff, setIsSignedOff] = useState(false);
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [voiceNotes, setVoiceNotes] = useState<VoiceNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useStateI understand. I'll continue the text stream from the cut-off point, maintaining coherence and consistency with the previous content. Here's the continuation:

loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const jobDetailsFromSession = sessionStorage.getItem('jobDetails');
    if (jobDetailsFromSession) {
      const { job_id } = JSON.parse(jobDetailsFromSession);
      fetchJobDetails(job_id);
    } else {
      setError('No job details found in session. Please go back to the home page.');
      setLoading(false);
    }
  }, []);

  const fetchJobDetails = async (jobId: number) => {
    try {
      const details = await getJobDetails(jobId);
      setJobDetails(details.body.record);
      setSummaryText(details.body.record.summary || '');
      setIsSignedOff(details.body.record.is_reviewed_accurate === 1);
      fetchVoiceNotes(jobId, 'report');
    } catch (error) {
      console.error('Failed to fetch job details:', error);
      setError('Failed to load job details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchVoiceNotes = async (jobId: number, type: string) => {
    try {
      const notes = await getVoiceNotes(jobId, type);
      setVoiceNotes(notes);
    } catch (error) {
      console.error('Error fetching voice notes:', error);
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <i className="bi bi-arrow-repeat" style={{ fontSize: '3rem' }}></i>
        <h2 className="mt-3">Loading...</h2>
      </div>
    );
  }

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
      <Header title="Job Report" style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000, backgroundColor: '#007bff', color: '#fff' }} />

      <main className="container-fluid my-4 px-3" style={{ paddingBottom: '120px', overflowY: 'auto', height: 'calc(100vh - 160px)' }}>
        {jobDetails && (
          <>
            <ImageGallery
              jobId={jobDetails.job_id}
              addImage={addImage}
              type="job"
              photos={photos}
              setPhotos={setPhotos}
              fetchOnLoad={true}
            />
            
            <SummarySection
              jobId={jobDetails.job_id}
              summaryLength={summaryLength}
              setSummaryLength={setSummaryLength}
              summaryText={summaryText}
              setSummaryText={setSummaryText}
            />
            
            <VoiceNoteRecorder
              jobId={jobDetails.job_id}
              type="report"
              voiceNotes={voiceNotes}
            />
            
            <SignOffCheckbox isSignedOff={isSignedOff} setIsSignedOff={setIsSignedOff} />
            
            <ActionButtons
              jobDetails={jobDetails}
              summaryText={summaryText}
              isSignedOff={isSignedOff}
            />
          </>
        )}
      </main>

      <BottomNav activePage="work-updates" style={{ position: 'fixed', bottom: 0, width: '100%', zIndex: 1000 }} />
    </div>
  );
};

export default WorkUpdatesPage;

