import { FC } from 'react';
import HeaderNotifications from './headerNotifications/HeaderNotifications';
import HeaderSettings from './headerSettings/HeaderSettings';
import './HeaderDropdowns.scss';

const HeaderDropdowns: FC = () => (
  <div className='header-dropdowns__wrapper'>
    {/* <HeaderNotifications /> */}
    <HeaderSettings />
  </div>
);

export default HeaderDropdowns;
