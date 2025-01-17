import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="bg-primary text-white text-center py-3 position-relative">
      <Image
        src="https://via.placeholder.com/50x50.png?text=Logo"
        alt="Company Logo"
        id="company-logo"
        width={50}
        height={50}
        className="position-absolute top-0 start-0 m-3"
      />
      <Link
        href="/"
        id="back-button"
        aria-label="Back"
        className="text-white position-absolute top-0 start-0 m-3"
        style={{ left: '70px' }}
      >
        <i className="bi bi-arrow-left-circle-fill" style={{ fontSize: '1.5rem' }}></i>
      </Link>
      <h1 className="mb-0">{title}</h1>
      <Link
        href="/settings"
        id="settings-icon"
        className="position-absolute top-0 end-0 m-3 text-white"
        aria-label="Settings"
      >
        <i className="bi bi-gear-fill" style={{ fontSize: '1.5rem' }}></i>
      </Link>
    </header>
  );
};

export default Header;

