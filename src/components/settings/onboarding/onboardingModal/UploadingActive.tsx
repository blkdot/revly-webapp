import { settingsOnboardPlatformStatus } from 'api';
import { useUser } from 'contexts';
import { useAlert } from 'hooks';
import { useAtom } from 'jotai';
import { ButtonKit } from 'kits';
import { FC } from 'react';
import {
  onboardingAccountsAtom,
  onboardingActiveStepAtom,
  onboardingBranchDataAtom,
  onboardingBranchDataFilteredAtom,
  onboardingBranchDataUploadingAtom,
  onboardingConnectAccountAtom,
  onboardingConnectAtom,
  onboardingLoadingAtom,
} from 'store/onboardingAtom';
import Arrow from '../../../../assets/icons/Arrow';
import CloseIcon from '../../../../assets/images/ic_close.svg';

const UploadingActive: FC<{
  openCloseModal: any;
  email: any;
  setEmail: any;
  setPassword: any;
  deleteAccount: any;
}> = ({ email, setEmail, setPassword, deleteAccount, openCloseModal }) => {
  const [, setConnectAccount] = useAtom(onboardingConnectAccountAtom);
  const [connect] = useAtom(onboardingConnectAtom);
  const [branchDataUploading, setBranchDataUploading] = useAtom(onboardingBranchDataUploadingAtom);
  const [accounts, setAccounts] = useAtom(onboardingAccountsAtom);
  const [branchData, setBranchData] = useAtom(onboardingBranchDataAtom);
  const [, setLoading] = useAtom(onboardingLoadingAtom);
  const [, setBranchDataFiltered] = useAtom(onboardingBranchDataFilteredAtom);
  const [, setActiveStep] = useAtom(onboardingActiveStepAtom);

  const platform = connect.charAt(0).toUpperCase() + connect.slice(1);
  const { triggerAlertWithMessageError } = useAlert();
  const user = useUser();
  const confirm = async () => {
    setLoading(true);
    const res = await settingsOnboardPlatformStatus(
      {
        master_email: user.email,
        access_token: user.token,
        email,
        active_status: true,
      },
      connect
    );
    setLoading(false);
    if (res instanceof Error) {
      triggerAlertWithMessageError(res.message);
      return;
    }
    setBranchData([...branchDataUploading, ...branchData]);
    setBranchDataFiltered([...branchDataUploading, ...branchData]);
    setActiveStep(100);
    setConnectAccount('completed');
    setAccounts([...accounts, { platform: connect, active: true, email }]);
    setEmail('');
    setPassword('');
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
