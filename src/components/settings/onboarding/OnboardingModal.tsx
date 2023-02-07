/* eslint-disable no-unused-vars */
import { saveUser } from 'api/userApi';
import { useUserAuth } from 'contexts';
import { useAlert, useApi } from 'hooks';
import { useState } from 'react';
import ConnectAccount from './onboardingModal/ConnectAccount';
import ConnectPlatform from './onboardingModal/ConnectPlatform';
import ManageAccount from './onboardingModal/ManageAccount';
import ManageBranch from './onboardingModal/ManageBranch';
import UploadingActive from './onboardingModal/UploadingActive';
import UploadingCompleted from './onboardingModal/UploadingCompleted';

const OnboardingModal = ({ propsVariables }) => {
  const {
    openCloseModal,
    openedModal,
    connectAccount,
    setBranchDataUploading,
    connect,
    setConnectAccount,
    accounts,
    setAccounts,
    branchData,
    setBranchData,
    vendors,
  } = propsVariables;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { settingsOnboardPlatform, settingsSave, settingsOnboardPlatformStatus } = useApi();
  const { user } = useUserAuth();
  const { triggerAlertWithMessageSuccess, triggerAlertWithMessageError } = useAlert();

  const handleSubmitLogin = async (currentPlatform) => {
    setIsLoading(true);
    const res = await settingsOnboardPlatform(
      {
        master_email: user.email,
        access_token: user.accessToken,
        credentials: {
          email,
          password,
        },
      },
      currentPlatform
    );
    setIsLoading(false);
    if (res instanceof Error) {
      triggerAlertWithMessageError(
        `We couldn’t connect to your ${currentPlatform} account. Please double check your credentials or contact customer support`
      );
      return;
    }
    setConnectAccount('active');
    setBranchDataUploading(
      res.vendors.map((obj) => ({
        branch_name: { title: obj.vendor_name, address: '' },
        accounts: [email],
        linked_platforms: [{ platform: connect, status: 'active' }],
        branch_status: 'in process',
        id: obj.vendor_id,
      }))
    );
  };
  const deleteAccount = async (platform, clickedEmail) => {
    await settingsSave({
      master_email: user.email,
      platform,
      email: clickedEmail,
      data: { is_deleted: true },
    });
    accounts.splice(
      accounts.findIndex((obj) => obj.email === clickedEmail),
      1
    );
    setBranchData(
      branchData.filter((obj) => obj.accounts.some((objAcc) => objAcc !== clickedEmail))
    );
    setAccounts([...accounts]);
  };

  const changeStatusAccount = async (obj: any) => {
    const vendorsBranch = () => {
      const arr = [];
      Object.keys(vendors.display).forEach((cName) => {
        Object.keys(vendors.display[cName]).forEach((vName) => {
          if (vendors.display[cName][vName].platforms[obj.platform]?.email === obj.email) {
            arr.push(vendors.display[cName][vName].platforms[obj.platform]);
          }
        });
      });
      return arr;
    };
    await saveUser({
      access_token: user.accessToken,
      vendors: { [obj.platform]: vendorsBranch() },
      data: { is_active: !obj.active },
    });

    await settingsOnboardPlatformStatus(
      {
        master_email: user.email,
        access_token: user.accessToken,
        email: obj.email,
        active_status: !obj.active,
      },
      obj.platform
    );
    accounts.find((objAcc) => objAcc.email === obj.email).active = !obj.active;
    setAccounts([...accounts]);
    setBranchData(
      branchData.map((objB) => {
        const linked_platforms = [...objB.linked_platforms];
        if (objB.accounts.find((emailAcc: string) => emailAcc === obj.email)) {
          if (!obj.active) {
            linked_platforms.find((objLink) => objLink.platform === obj.platform).status =
              'suspended';
            if (objB.linked_platforms.every((objLink) => objLink.status !== 'active')) {
              return { ...objB, branch_status: 'suspended', linked_platforms };
            }
            if (objB.linked_platforms.length === 1) {
              return { ...objB, branch_status: 'suspended', linked_platforms };
            }
            return { ...objB, linked_platforms };
          }
          linked_platforms.find((objLink) => objLink.platform === obj.platform).status = 'active';
          if (objB.linked_platforms.length > 1) {
            return { ...objB, branch_status: 'active', linked_platforms };
          }
          return { ...objB, branch_status: 'in process', linked_platforms };
        }
        return objB;
      })
    );
  };
  const connectAccountModalObject = {
    manageAccount: (
      <ManageAccount propsVariables={{ ...propsVariables, deleteAccount, changeStatusAccount }} />
    ),
    manageBranch: <ManageBranch propsVariables={{ ...propsVariables }} />,
    completed: <UploadingCompleted propsVariables={propsVariables} />,
    active: (
      <UploadingActive
        propsVariables={{
          ...propsVariables,
          email,
          setEmail,
          setPassword,
          password,
          deleteAccount,
        }}
      />
    ),
    platform: (
      <ConnectPlatform
        propsVariables={{
          ...propsVariables,
          email,
          setEmail,
          setPassword,
          password,
          handleSubmitLogin,
          isLoading,
        }}
      />
    ),
    account: (
      <ConnectAccount propsVariables={{ ...propsVariables, deleteAccount, changeStatusAccount }} />
    ),
  };
  return (
    <div
      tabIndex={-1}
      role='presentation'
      className={`onboarding-modal_overlay ${openedModal ? 'active' : ''}`}
      onClick={openCloseModal}
    >
      {connectAccountModalObject[connectAccount]}
    </div>
  );
};

export default OnboardingModal;
