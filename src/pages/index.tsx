import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from '@/components/common/Header';
import BottomNav from '@/components/BottomNav';
import { getJobDetailsByCode } from '@/services/api';

interface JobDetails {
  job_id: number;
  job_code: string;
  description: string;
  status: string;
  user_name: string;
  tasks: Task[];
}

interface Task {
  task_id: number;
  task_description: string;
  status: string;
}

const HomePage: React.FC = () => {
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
  const [recentActivities, setRecentActivities] = useState<Task[]>([]);
  const [workerName, setWorkerName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const { job: jobCodeParam } = router.query;

    if (jobCodeParam && typeof jobCodeParam === 'string') {
      getJobDetailsByCode(jobCodeParam)
        .then((data) => {
          if (data && data.body && data.body.record) {
            const { job_id, job_code, description, user_name, tasks } = data.body.record;
            setJobDetails(data.body.record);
            setWorkerName(user_name);
            const allTasks = tasks || [];
            setPendingTasks(allTasks.filter(task => task.status.toLowerCase() === 'pending'));
            setRecentActivities(allTasks.filter(task => task.status.toLowerCase() !== 'pending'));
            sessionStorage.setItem('jobDetails', JSON.stringify({ job_id, job_code, description }));
          } else {
            setError('Job details not found.');
          }
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    } else {
      const jobDetailsFromSession = sessionStorage.getItem('jobDetails');
      if (jobDetailsFromSession) {
        const { job_id, job_code } = JSON.parse(jobDetailsFromSession);
        fetchJobDetails(job_id, job_code);
      } else {
        setError('No job code provided in the URL or session.');
        setLoading(false);
      }
    }
  }, [router.query]);

  const fetchJobDetails = async (job_id: number, job_code: string) => {
    try {
      const data = await getJobDetailsByCode(job_code);
      if (data && data.body && data.body.record) {
        setJobDetails(data.body.record);
        setWorkerName(data.body.record.user_name);
        const allTasks = data.body.record.tasks || [];
        setPendingTasks(allTasks.filter(task => task.status.toLowerCase() === 'pending'));
        setRecentActivities(allTasks.filter(task => task.status.toLowerCase() !== 'pending'));
      } else {
        setError('Job details not found.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
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
      <Header title={`Job Overview: ${jobDetails?.job_code}`} style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000, backgroundColor: '#007bff', color: '#fff' }} />

      <main className="container-fluid my-4 px-3" style={{ paddingBottom: '120px', overflowY: 'auto', height: 'calc(100vh - 160px)' }}>
        <section id="job-description" className="mb-4">
          <h2>Job Description</h2>
          <p>{jobDetails?.description}</p>
          <p><strong>Worker Name:</strong> {workerName}</p>
          <p><strong>Status:</strong> {jobDetails?.status.charAt(0).toUpperCase() + jobDetails?.status.slice(1)}</p>
        </section>

        {/* Quick Access Buttons */}
        <section id="quick-access" className="row g-3 mb-4">
          <div className="col-6">
            <Link
              href="/work-updates"
              className={`btn ${jobDetails?.status === 'submitted' ? 'btn-secondary' : 'btn-success'} w-100 py-3 d-flex flex-column align-items-center`}
            >
              <i className="bi bi-journal-text mb-2" style={{ fontSize: '2rem' }}></i>
              <span>{jobDetails?.status === 'submitted' ? 'Work Completed' : 'Update Work Progress'}</span>
            </Link>
          </div>
          <div className="col-6">
            <Link
              href="/asset-scan"
              className="btn btn-success w-100 py-3 d-flex flex-column align-items-center"
            >
              <i className="bi bi-upc-scan mb-2" style={{ fontSize: '2rem' }}></i>
              <span>Scan Asset</span>
            </Link>
          </div>
          <div className="col-6">
            <Link
              href="/safety-report"
              className="btn btn-success w-100 py-3 d-flex flex-column align-items-center"
            >
              <i className="bi bi-exclamation-triangle-fill mb-2" style={{ fontSize: '2rem' }}></i>
              <span>Report Safety Issue</span>
            </Link>
          </div>
          <div className="col-6">
            <Link
              href="/voice-notes"
              className="btn btn-success w-100 py-3 d-flex flex-column align-items-center"
            >
              <i className="bi bi-mic-fill mb-2" style={{ fontSize: '2rem' }}></i>
              <span>Add Voice Note</span>
            </Link>
          </div>
        </section>

        {/* Summary Section */}
        <section id="summary" className="mt-4">
          <h2>Pending Tasks</h2>
          <ul className="list-group mb-3">
            {pendingTasks.length > 0 ? (
              pendingTasks.map((task) => (
                <li key={task.task_id} className="list-group-item">
                  <p><strong>Task:</strong> {task.task_description}</p>
                  <p><strong>Status:</strong> {task.status.charAt(0).toUpperCase() + task.status.slice(1)}</p>
                </li>
              ))
            ) : (
              <li className="list-group-item">No pending tasks.</li>
            )}
          </ul>
          <h2>Recent Activity</h2>
          <ul className="list-group">
            {recentActivities.length > 0 ? (
              recentActivities.map((task) => (
                <li key={task.task_id} className="list-group-item">
                  <p><strong>Task:</strong> {task.task_description}</p>
                </li>
              ))
            ) : (
              <li className="list-group-item">No recent activity.</li>
            )}
          </ul>
        </section>
      </main>

      <BottomNav activePage="home" style={{ position: 'fixed', bottom: 0, width: '100%', zIndex: 1000 }} />
    </div>
  );
};

export default HomePage;

