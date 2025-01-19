import React, { useState } from 'react';
import { jobSummary } from '../services/api';

interface SummarySectionProps {
  jobId: number | null;
  summaryLength: string;
  setSummaryLength: React.Dispatch<React.SetStateAction<string>>;
  summaryText: string;
  setSummaryText: React.Dispatch<React.SetStateAction<string>>;
}

const SummarySection: React.FC<SummarySectionProps> = ({ jobId, summaryLength, setSummaryLength, summaryText, setSummaryText }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateSummary = async () => {
    if (!jobId) {
      alert('No job details available to generate summary.');
      return;
    }

    const jobDetails = JSON.parse(sessionStorage.getItem('jobDetails') || '{}');
    const description = jobDetails?.description;

    if (!description) {
      alert('No description available for the job.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await jobSummary(jobId, description);
      const summary = response?.body?.data?.summary || 'AI-generated summary is not available.';
      setSummaryText(summary);
    } catch (err) {
      setError('Failed to generate summary. Please try again later.');
      setSummaryText('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="summary-section" className="mb-4">
      <button
        id="generate-summary-button"
        className="btn btn-primary w-100 mb-4"
        onClick={handleGenerateSummary}
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate Summary'}
      </button>

      <h2>Summary</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <textarea
        id="summary-text"
        rows={6}
        className="form-control"
        placeholder="AI-generated summary will appear here."
        value={summaryText}
        onChange={(e) => setSummaryText(e.target.value)}
      ></textarea>
    </section>
  );
};

export default SummarySection;

