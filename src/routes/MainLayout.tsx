import { Outlet } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';

export const MainLayout = () => (
  <div className='user-page'>
    <Navbar />
    <Outlet />
  </div>
);
