import React, { useState } from 'react';

import { FaUserAlt, FaCreditCard, FaTruck } from 'react-icons/fa';
import { BsKeyFill } from 'react-icons/bs';

import './Settings.scss';

import HeaderBreadcrumbs from '../../components/headerBreadcrumbs/HeaderBreadcrumbs';
import SettingsOnboarding from '../../components/settings/onboarding/SettingsOnboarding';
import General from '../../components/settings/general/General';
import Billing from '../../components/settings/billing/Billing';

import TabKit from '../../kits/tab/TabKit';
import TabsKit from '../../kits/tabs/TabsKit';
import BoxKit from '../../kits/box/BoxKit';
import ContainerKit from '../../kits/container/ContainerKit';


const Settings = () => {
  const [currentTab, setCurrentTab] = useState('general');

  const ACCOUNT_TABS = [
    {
      value: 'general',
      icon: <FaUserAlt width={20} height={20} style={{ marginRight: 5 }} />,
      component: <General />,
    },
    {
      value: 'billing',
      icon: <FaCreditCard width={20} height={20} style={{ marginRight: 5 }} />,
      component: <Billing />,
    },
    {
      value: 'onboarding',
      icon: <FaTruck width={20} height={20} style={{ marginRight: 5 }} />,
      component: <SettingsOnboarding />,
    },
    {
      value: 'reset_password',
      icon: <BsKeyFill width={20} height={20} style={{ marginRight: 5 }} />,
      component: <div>Reset Password</div>,
    },
  ];

  const handleTabChange = (_, v) => {
    setCurrentTab(v);
  }

  return (
    <ContainerKit>
      <HeaderBreadcrumbs
        heading='Account Settings'
        links={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Settings', href: '/settings' },
          { name: 'Account Settings' },
        ]}
      />
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
        return isMatched && <BoxKit key={tab.value}>{tab.component}</BoxKit>;
      })}
    </ContainerKit>
  );
};

export default Settings;
