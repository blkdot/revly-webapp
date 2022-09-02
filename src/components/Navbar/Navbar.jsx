import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <div className='Navbar'>
      <ul>
        <li>Logo</li>
        <li>Dashboard</li>
        <li>
          Marketing
          <ul>
            <li>Offers</li>
            <li>Ads</li>
          </ul>
        </li>
        <li>Competition</li>
        <li>Alert</li>
        <Link to='/settings'>Settings</Link>
        <li>Profile</li>
      </ul>
    </div>
  );
}

export default Navbar;
