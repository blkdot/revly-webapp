import React from 'react';
import { Link } from 'react-router-dom';

const Settings = () => {
  return (
    <div>
      <h2>Settings</h2>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Link to='/onboarding'>Onboarding</Link>
        <Link to='/settings/account'>Account Settings</Link>
      </div>
    </div>
  );
};

export default Settings;
