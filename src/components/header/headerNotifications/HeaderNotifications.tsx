import { FC } from 'react'
import { ReactComponent as NotificationsIcon } from './icons/notifications.svg';
import './HeaderNotifications.scss'

const HeaderNotifications: FC = () => (<span className='header-notifictions__block'>
  <NotificationsIcon />
</span>)
export default HeaderNotifications