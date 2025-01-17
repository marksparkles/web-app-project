import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

interface VoiceNote {
  note_id: number;
  voice_note_blob: string;
  created_at: string;
  type: string;
}

interface VoiceNoteRecorderProps {
  jobId: number;
  voiceNotes: VoiceNote[];
  type: string;
}

const VoiceNoteRecorder: React.FC<VoiceNoteRecorderProps> = ({ jobId, voiceNotes, type }) => {
  const [voiceNote, setVoiceNote] = useState<string | null>(null);
  const [voiceNoteBlob, setVoiceNoteBlob] = useState<Blob | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioElementRef.current) {
      audioElementRef.current.onerror = (event) => {
        console.error('An error occurred during audio playback:', event);
      };
    }
  }, [voiceNote]);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/mp4' });
      chunks.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(chunks.current, { type: 'audio/mp4' });
        setVoiceNoteBlob(blob);
        setVoiceNote(URL.createObjectURL(blob));
        await handleUploadRecording(blob);
      };

      mediaRecorderRef.current.onerror = (event) => {
        console.error('Recording error:', event);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      alert('Recording is not active.');
    }
  };

  const handleUploadRecording = async (blob: Blob) => {
    if (blob) {
      try {
        const base64Data = await convertBlobToBase64(blob);
        const response = await axios.post('http://localhost:5001/db', {
          action: {
            operation: 'add_voice_note',
            job_id: jobId,
            voice_note_data: base64Data,
            type: type,
          }
        });
        console.log('Upload response:', response.data);
        alert('Voice note uploaded successfully!');
      } catch (error) {
        console.error('Error uploading voice note:', error);
      }
    }
  };

  const convertBlobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result as string;
        resolve(base64data.split(',')[1]);
      };
      reader.onerror = error => reject(error);
    });
  };

  return (
    <section id="voice-note" className="mb-4">
      {!isRecording ? (
        <button className="btn btn-danger w-100 w-md-auto" onClick={handleStartRecording}>
          <i className="bi bi-mic-fill me-2"></i>Record Voice Note
        </button>
      ) : (
        <button className="btn btn-warning w-100 w-md-auto" onClick={handleStopRecording}>
          <i className="bi bi-stop-fill me-2"></i>Stop Recording
        </button>
      )}

      {voiceNote && (
        <div className="mt-3">
          <audio ref={audioElementRef} controls src={voiceNote}></audio>
          <button className="btn btn-outline-secondary mt-3 ms-3" onClick={() => setVoiceNote(null)}>
            <i className="bi bi-trash-fill me-2"></i>Delete Recording
          </button>
        </div>
      )}

      {voiceNotes && voiceNotes.length > 0 && (
        <div className="previous-voice-notes mt-4">
          <h3>Previous Voice Notes</h3>
          {voiceNotes
            .filter(note => note.type === type)
            .map((note) => (
              <div key={note.note_id} className="voice-note-item">
                <audio controls src={`data:audio/mp4;base64,${note.voice_note_blob}`}></audio>
                <p><strong>Recorded At:</strong> {new Date(note.created_at).toLocaleString()}</p>
              </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default VoiceNoteRecorder;

