import React, { useState } from 'react';
import Header from '@/components/common/Header';
import BottomNav from '@/components/BottomNav';

interface HistoryEntry {
  type: string;
  title: string;
  status: string;
  timestamp: string;
}

const HistoryPage: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const historyEntries: HistoryEntry[] = [
    { type: 'report', title: 'Job Report - 2023-10-01', status: 'Submitted', timestamp: '10:00 AM' },
    { type: 'safety', title: 'Safety Issue - 2023-09-30', status: 'Submitted', timestamp: '2:30 PM' },
    // More entries can be added here
  ];

  const handleFilterClick = (filterType: string) => {
    setFilter(filterType);
  };

  const filteredEntries = historyEntries.filter((entry) => {
    return filter === 'all' || entry.type === filter;
  }).filter((entry) => {
    return entry.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div>
      <Header title="History" />

      {/* Main Content */}
      <main className="container my-4">
        {/* Filters */}
        <section id="filters" className="mb-4">
          <div className="btn-group w-100" role="group" aria-label="History Filters">
            <button type="button" className={`btn btn-outline-primary ${filter === 'all' ? 'active' : ''}`} onClick={() => handleFilterClick('all')}>All</button>
            <button type="button" className={`btn btn-outline-primary ${filter === 'reports' ? 'active' : ''}`} onClick={() => handleFilterClick('reports')}>Reports</button>
            <button type="button" className={`btn btn-outline-primary ${filter === 'safety' ? 'active' : ''}`} onClick={() => handleFilterClick('safety')}>Safety Issues</button>
            <button type="button" className={`btn btn-outline-primary ${filter === 'assets' ? 'active' : ''}`} onClick={() => handleFilterClick('assets')}>Assets</button>
          </div>
        </section>

        {/* Search Bar */}
        <section id="search-bar" className="mb-4">
          <input
            type="text"
            id="search-input"
            className="form-control"
            placeholder="Search history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </section>

        {/* History List */}
        <section id="history-list">
          {filteredEntries.map((entry, index) => (
            <div key={index} className="history-entry mb-3" data-type={entry.type}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{entry.title}</h5>
                  <p className="card-text">Status: {entry.status}</p>
                  <p className="card-text">Timestamp: {entry.timestamp}</p>
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>

      {/* Bottom Navigation Bar */}
      <BottomNav activePage="history" />
    </div>
  );
};

export default HistoryPage;

