import { ContainerKit } from 'kits';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';

const MainLayout = () => (
  <div className='user-page'>
    <Navbar />
    <ContainerKit>
      <Outlet />
    </ContainerKit>
  </div>
);

export default MainLayout;
