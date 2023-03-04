import { settingsOnboardPlatformStatus } from 'api';
import { useUser } from 'contexts';
import { useAlert } from 'hooks';
import { ButtonKit } from 'kits';
import { FC } from 'react';
import Arrow from '../../../../assets/icons/Arrow';
import CloseIcon from '../../../../assets/images/ic_close.svg';

const UploadingActive: FC<{
  propsVariables: {
    branchDataUploading: any;
    setBranchDataUploading: any;
    setEmail: any;
    setPassword: any;
    setBranchData: any;
    openCloseModal: any;
    setAccounts: any;
    accounts: any;
    branchData: any;
    connect: any;
    email: any;
    setConnectAccount: any;
    setActiveStep: any;
    deleteAccount: any;
  };
}> = ({ propsVariables }) => {
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
    deleteAccount,
  } = propsVariables;
  const platform = connect.charAt(0).toUpperCase() + connect.slice(1);
  const { triggerAlertWithMessageError } = useAlert();
  const user = useUser();
  const confirm = async () => {
    const res = await settingsOnboardPlatformStatus(
      {
        master_email: user.email,
        access_token: user.token,
        email,
        active_status: true,
      },
      connect
    );
    if (res instanceof Error) {
      triggerAlertWithMessageError(res.message);
      return;
    }

    setActiveStep(100);
    setConnectAccount('completed');
    setAccounts([...accounts, { platform: connect, active: true, email }]);
    setEmail('');
    setPassword('');
    setBranchData([...branchDataUploading, ...branchData]);
  };
  return (
    <div
      className='onboarding-connect-account'
      tabIndex={-1}
      role='presentation'
      onClick={(e) => e.stopPropagation()}
    >
      <img
        className='onboarding-close_icon modal'
        tabIndex={-1}
        role='presentation'
        src={CloseIcon}
        alt='close icon'
        onClick={openCloseModal}
      />
      <div>
        <p className='__title'>Your Data is Being uploaded</p>
        <span className='__subtitle'>
          Your {platform} account has been connect , we are uploading the necessary data to manage
          your brands
        </span>
      </div>
      <div className='onboarding-branches-uploading'>
        <p className='__title'>{branchDataUploading.length} Branches Has been uploaded</p>
        {branchDataUploading.map((obj) => (
          <div key={obj.id}>
            <div>
              <p className='__title'>{obj.branch_name}</p>
            </div>
            <ButtonKit variant='contained'>Added</ButtonKit>
          </div>
        ))}
      </div>
      <div className='onboarding-platform-buttons account'>
        <ButtonKit
          style={{ '--color': '#F9FAFB', color: 'black' } as React.CSSProperties}
          onClick={() => {
            setConnectAccount('platform');
            setBranchDataUploading([]);
            deleteAccount(connect, email);
          }}
          variant='contained'
        >
          Cancel
        </ButtonKit>
        <ButtonKit
          className='onboarding-platform-buttons_confirm'
          variant='contained'
          style={{ '--color': '#9A6FFF' } as React.CSSProperties}
          onClick={confirm}
        >
          Confirm <Arrow />
        </ButtonKit>
      </div>
    </div>
  );
};

export default UploadingActive;
