import { FC, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Popover } from 'antd';
import { settingsLink } from 'data/navbarData';
import { ReactComponent as ArrowUp } from './icons/arrow-up.svg';
import { ReactComponent as ArrowDown } from './icons/arrow-down.svg';
import { ReactComponent as SettingsIcon } from './icons/settings.svg';
import './HeaderSettings.scss';

const HeaderSettings: FC = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = (value) => {
    setOpen(value);
    const body = document.querySelector('body');
    if (value) {
      body.style.overflowY = 'hidden';
      return;
    }
    body.style.overflowY = 'visible';
  };
  const renderContent = () =>
    settingsLink.map((obj) => (
      <NavLink key={obj.title} className='header-settings__nav-item' to={obj.path}>
        {obj.title}
      </NavLink>
    ));
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        handleOpen(!open);
      }}
      tabIndex={-1}
      role='presentation'
      className='header-settings__wrapper'
    >
      <Popover
        placement='bottomLeft'
        open={open}
        trigger='click'
        onOpenChange={handleOpen}
        rootClassName='header-settings__content'
        content={renderContent()}
      >
        <div className='header-settings__block'>
          <SettingsIcon />
        </div>
      </Popover>
      {open ? (
        <ArrowUp
          onClick={(e) => {
            e.stopPropagation();
            handleOpen(!open);
          }}
          tabIndex={-1}
          role='presentation'
        />
      ) : (
        <ArrowDown
          onClick={(e) => {
            e.stopPropagation();
            handleOpen(!open);
          }}
          tabIndex={-1}
          role='presentation'
        />
      )}
    </div>
  );
};
export default HeaderSettings;
