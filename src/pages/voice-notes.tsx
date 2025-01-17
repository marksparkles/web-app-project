import React, { useState, useEffect } from 'react';
import Header from '@/components/common/Header';
import BottomNav from '@/components/BottomNav';
import VoiceNoteRecorder from '@/components/VoiceNoteRecorder';
import { getVoiceNotes } from '@/services/api';

interface VoiceNote {
  note_id: number;
  voice_note_blob: string;
  created_at: string;
}

const VoiceNotesPage: React.FC = () => {
  const [voiceNotes, setVoiceNotes] = useState<VoiceNote[]>([]);
  const [jobId, setJobId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const jobDetailsFromSession = sessionStorage.getItem('jobDetails');
    if (jobDetailsFromSession) {
      const { job_id } = JSON.parse(jobDetailsFromSession);
      setJobId(job_id);
      fetchVoiceNotes(job_id);
    } else {
      setError('No job details found in session. Please go back to the home page.');
    }
  }, []);

  const fetchVoiceNotes = async (jobId: number) => {
    try {
      const notes = await getVoiceNotes(jobId, 'general');
      setVoiceNotes(notes);
    } catch (error) {
      console.error('Error fetching voice notes:', error);
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
    <div>
      <Header title="Voice Notes" />

      {/* Main Content */}
      <main className="container my-4">
        {/* Record Voice Note Section */}
        <section id="record-voice-note" className="mb-4 text-center">
          <h2>Record a Voice Note</h2>
          <VoiceNoteRecorder jobId={jobId} type="general" voiceNotes={voiceNotes} />
        </section>
      </main>

      {/* Bottom Navigation Bar */}
      <BottomNav activePage="voice-notes" />
    </div>
  );
};

export default VoiceNotesPage;

