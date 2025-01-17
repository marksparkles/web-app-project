import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const SettingsPage: React.FC = () => {
  const [logoPreview, setLogoPreview] = useState('/placeholder.svg?height=150&width=150');
  const [defaultSummary, setDefaultSummary] = useState('3');
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [smsNotifications, setSmsNotifications] = useState(false);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSettings = () => {
    // Handle saving the settings logic here
    alert('Settings saved successfully');
  };

  return (
    <div>
      {/* Header */}
      <header className="bg-primary text-white text-center py-3 position-relative">
        <Image
          src="/placeholder.svg"
          alt="Company Logo"
          id="company-logo"
          width={50}
          height={50}
          className="position-absolute top-0 start-0 m-3"
        />
        <Link href="/" id="back-button" aria-label="Back" className="text-white position-absolute top-0 start-0 m-3" style={{ left: '70px' }}>
          <i className="bi bi-arrow-left-circle-fill" style={{ fontSize: '1.5rem' }}></i>
        </Link>
        <h1 className="mb-0">Settings</h1>
      </header>

      {/* Main Content */}
      <main className="container my-4">
        {/* Profile Section */}
        <section id="profile-section" className="mb-4">
          <h2>Profile</h2>
          {/* Upload Logo */}
          <label htmlFor="upload-logo" className="form-label">Upload Logo:</label>
          <input type="file" id="upload-logo" className="form-control" accept="image/*" onChange={handleLogoUpload} />
          {/* Logo Preview */}
          <div id="logo-preview" className="mt-3 text-center">
            <Image src={logoPreview || "/placeholder.svg"} alt="Logo Preview" width={150} height={150} className="img-fluid border" />
          </div>
        </section>

        {/* Preferences */}
        <section id="preferences" className="mb-4">
          <h2>Preferences</h2>
          {/* Default Summary Length */}
          <label htmlFor="default-summary" className="form-label">Default Summary Length:</label>
          <select
            id="default-summary"
            className="form-select"
            value={defaultSummary}
            onChange={(e) => setDefaultSummary(e.target.value)}
          >
            <option value="3">3 Steps</option>
            <option value="5">5 Steps</option>
            <option value="10">10 Steps</option>
          </select>
          {/* Notification Settings */}
          <div id="notification-settings" className="mt-3">
            <h3>Notifications</h3>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="emailNotifications"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="emailNotifications">
                Email Notifications
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="smsNotifications"
                checked={smsNotifications}
                onChange={(e) => setSmsNotifications(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="smsNotifications">
                SMS Notifications
              </label>
            </div>
          </div>
        </section>

        {/* Save Button */}
        <button id="save-settings-button" className="btn btn-success w-100" onClick={handleSaveSettings}>Save Settings</button>
      </main>
    </div>
  );
};

export default SettingsPage;

