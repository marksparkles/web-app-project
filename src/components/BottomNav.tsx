import React from 'react';
import Link from 'next/link';

interface BottomNavProps {
  activePage: string;
}

const BottomNav: React.FC<BottomNavProps> = ({ activePage }) => {
  return (
    <nav id="bottom-nav" className="navbar fixed-bottom navbar-dark bg-dark">
      <div className="container-fluid justify-content-around">
        <Link href="/" className={`nav-link text-center text-white ${activePage === 'home' ? 'active' : ''}`}>
          <i className="bi bi-house-door-fill" style={{ fontSize: '1.5rem' }}></i>
          <div style={{ fontSize: '0.75rem' }}>Home</div>
        </Link>
        <Link href="/safety-report" className={`nav-link text-center text-white ${activePage === 'safety' ? 'active' : ''}`}>
          <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: '1.5rem' }}></i>
          <div style={{ fontSize: '0.75rem' }}>Safety Report</div>
        </Link>
        <Link href="/work-updates" className={`nav-link text-center text-white ${activePage === 'updates' ? 'active' : ''}`}>
          <i className="bi bi-journal-text" style={{ fontSize: '1.5rem' }}></i>
          <div style={{ fontSize: '0.75rem' }}>Work Updates</div>
        </Link>
        <Link href="/asset-scan" className={`nav-link text-center text-white ${activePage === 'assets' ? 'active' : ''}`}>
          <i className="bi bi-upc-scan" style={{ fontSize: '1.5rem' }}></i>
          <div style={{ fontSize: '0.75rem' }}>Assets</div>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNav;

