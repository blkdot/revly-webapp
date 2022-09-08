import React, { useState } from 'react';

import { FaUserAlt, FaCreditCard, FaTruck } from 'react-icons/fa';

import './SettingAccount.scss';

import HeaderBreadcrumbs from '../../../components/headerBreadcrumbs/HeaderBreadcrumbs';

import TabKit from '../../../kits/tab/TabKit';
import TabsKit from '../../../kits/tabs/TabsKit';
import BoxKit from '../../../kits/box/BoxKit';
import ContainerKit from '../../../kits/container/ContainerKit';

import General from '../../../components/setting/general/General';

const SettingAccount = () => {
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
      component: <div>Billing content here</div>,
    },
    {
      value: 'onboarding',
      icon: <FaTruck width={20} height={20} style={{ marginRight: 5 }} />,
      component: <div>Onboarding content here</div>,
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
            label={tab.value}
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

export default SettingAccount;
