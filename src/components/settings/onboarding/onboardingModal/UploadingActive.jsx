import React from 'react';
import CloseIcon from '../../../../assets/images/ic_close.png';
import ButtonKit from '../../../../kits/button/ButtonKit';
import Arrow from '../../../../assets/icons/Arrow';
import useApi from '../../../../hooks/useApi';
import { useUserAuth } from '../../../../contexts/AuthContext';
import { useAlert } from '../../../../hooks/useAlert';
import { usePlatform } from '../../../../hooks/usePlatform';

const UploadingActive = ({ propsVariables }) => {
  const {
    branchDataUploading,
    setBranchDataUploading,
    setEmail,
    setPassword,
    setBranchData,
    openCloseModal,
    setAccounts,
    accounts,
    branchData,
    connect,
    email,
    setConnectAccount,
    setActiveStep,
  } = propsVariables;
  const platform = connect.charAt(0).toUpperCase() + connect.slice(1);
  const { settingsOnboardPlatformStatus } = useApi();
  const { triggerAlertWithMessageError } = useAlert();
  const { user } = useUserAuth();
  const { setUserPlatformData, userPlatformData } = usePlatform();
  const confirm = async () => {
    const res = await settingsOnboardPlatformStatus(
      {
        master_email: user.email,
        access_token: user.accessToken,
        email,
        active_status: true,
      },
      connect,
    );

    if (res instanceof Error) {
      triggerAlertWithMessageError(res.message);
      return;
    }

    setUserPlatformData({
      ...userPlatformData,
      platforms: { ...userPlatformData.platforms, [connect]: res },
    });
    setActiveStep(100);
    setConnectAccount('completed');
    setAccounts([...accounts, { platform: connect, active: true, email }]);
    setEmail('');
    setPassword('');
    setBranchData([...branchData, ...branchDataUploading]);
  };
  return (
    <div
      className="onboarding-connect-account"
      tabIndex={-1}
      role="presentation"
      onClick={(e) => e.stopPropagation()}
    >
      <img
        className="onboarding-close_icon modal"
        tabIndex={-1}
        role="presentation"
        src={CloseIcon}
        alt="close icon"
        onClick={openCloseModal}
      />
      <div>
        <p className="__title">Your Data is Being uploaded</p>
        <span className="__subtitle">
          Your {platform} account has been connect , we are uplouploading the necessary data to
          manage your brands
        </span>
      </div>
      <div className="onboarding-branches-uploading">
        <p className="__title">{branchDataUploading.length} Branches Has been uploaded</p>
        {branchDataUploading.map((obj) => (
          <div key={obj.id}>
            <div>
              <p className="__title">{obj.branch_name.title}</p>
              <span className="__subtitle">{obj.branch_name.address}</span>
            </div>
            <ButtonKit variant="contained">Added</ButtonKit>
          </div>
        ))}
      </div>
      <div className="onboarding-platform-buttons account">
        <ButtonKit
          style={{ '--color': '#F9FAFB', color: 'black' }}
          onClick={() => {
            setConnectAccount('platform');
            setBranchDataUploading([]);
          }}
          variant="contained"
        >
          Cancel
        </ButtonKit>
        <ButtonKit
          className="onboarding-platform-buttons_confirm"
          variant="contained"
          style={{ '--color': '#9A6FFF' }}
          onClick={confirm}
        >
          Confirm <Arrow />
        </ButtonKit>
      </div>
    </div>
  );
};

export default UploadingActive;
