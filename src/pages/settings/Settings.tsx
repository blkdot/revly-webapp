import { Description, Password, Person, Send } from '@mui/icons-material';
import { CostIcon, MenuIcon } from 'assets/icons';
import { BoxKit, TabKit, TabsKit, TypographyKit } from 'kits';
import { useState } from 'react';
import Billing from '../../components/settings/billing/Billing';
import ChangePassword from '../../components/settings/changePassword/ChangePassword';
import Cost from '../../components/settings/cost/Cost';
import General from '../../components/settings/general/General';
import Menu from '../../components/settings/menu/Menu';
import NewSettingsOnboarding from '../../components/settings/onboarding/NewSettingsOnboarding';
import './Settings.scss';

const Settings = () => {
  const [currentTab, setCurrentTab] = useState('general');

  const ACCOUNT_TABS = [
    {
      value: 'general',
      icon: (
        <div className='icon-block'>
          <Person className='__icon' />
        </div>
      ),
      component: <General />,
      subtitle: <p className='subtitle' />,
    },
    {
      value: 'billing',
      icon: (
        <div className='icon-block'>
          <Description className='__icon' />
        </div>
      ),
      component: <Billing />,
    },
    {
      value: 'onboarding',
      icon: (
        <div className='icon-block'>
          <Send className='__icon' />
        </div>
      ),
      component: <NewSettingsOnboarding />,
      subtitle: <p className='subtitle' />,
    },
    {
      value: 'change password',
      icon: (
        <div className='icon-block'>
          <Password className='__icon' />
        </div>
      ),
      component: <ChangePassword />,
      subtitle: <p className='subtitle' />,
    },
    {
      value: 'menu',
      icon: (
        <div className='icon-block'>
          <MenuIcon className='__icon __menu' />
        </div>
      ),
      component: <Menu />,
      subtitle: <p className='subtitle' />,
    },
    {
      value: 'cost',
      icon: (
        <div className='icon-block'>
          <CostIcon className='__icon __menu' />
        </div>
      ),
      component: <Cost />,
      subtitle: <p className='subtitle' />,
    },
  ];

  const handleTabChange = (_, v) => {
    setCurrentTab(v);
  };

  return (
    <div className='setting-account'>
      <TypographyKit fontSize='32px' color='#212B36' fontWeight='700' variant='h4'>
        Settings - {currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}
      </TypographyKit>
      <div className='__content'>
        <TabsKit
          allowScrollButtonsMobile
          variant='scrollable'
          scrollButtons='auto'
          value={currentTab}
          onChange={handleTabChange}
          className='setting-account__tabs'
        >
          {ACCOUNT_TABS.map((tab) => (
            <TabKit
              className={`setting-account__tabs-tab ${currentTab === tab.value ? '__active' : ''}`}
              disableRipple
              key={tab.value}
              label={tab.value.replace('_', ' ')}
              icon={tab.icon}
              value={tab.value}
            />
          ))}
        </TabsKit>
        <BoxKit sx={{ mb: 5 }} />
        {ACCOUNT_TABS.map((tab) => {
          const isMatched = tab.value === currentTab;
          return (
            isMatched && (
              <div key={tab.value}>
                {tab.subtitle || null}
                <BoxKit key={tab.value}>{tab.component}</BoxKit>
              </div>
            )
          );
        })}
      </div>
    </div>
  );
};

export default Settings;
