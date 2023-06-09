import { FC } from 'react';
import { useAtom } from 'jotai';
import { onboardingConnectAccountAtom, onboardingConnectAtom } from 'store/onboardingAtom';
import { Arrow } from 'assets/icons';
import { platformList } from 'data/platformList';
import { ButtonKit, ButtonLoadingKit, TextfieldKit } from 'kits';
import CloseIcon from '../../../../assets/images/ic_close.svg';

const ConnectPlatform: FC<{
  openCloseModal: () => void;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  email: string;
  password: string;
  handleSubmitLogin: (platform: string) => void;
  isLoading: boolean;
}> = ({ openCloseModal, setEmail, setPassword, email, password, handleSubmitLogin, isLoading }) => {
  const [connect, setConnect] = useAtom(onboardingConnectAtom);
  const [, setConnectAccount] = useAtom(onboardingConnectAccountAtom);

  const platform = connect.charAt(0).toUpperCase() + connect.slice(1);
  const platformObj = platformList.find((obj) => obj.name === connect);
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
        <p className='__title'>Connect to your {platform} Account</p>
        <span className='__subtitle'>
          Use your {platform} Email and password to connect your account
        </span>
        <TextfieldKit
          className='onboarding-textfield'
          placeholder='Email Address'
          onChange={({ target }) => setEmail(target.value)}
          value={email}
        />
        <TextfieldKit
          className='onboarding-textfield'
          placeholder='Password'
          onChange={({ target }) => setPassword(target.value)}
          value={password}
        />
      </div>
      <div className='onboarding-platform-buttons account'>
        <ButtonKit
          onClick={() => {
            setConnect('');
            setConnectAccount('account');
            setEmail('');
            setPassword('');
          }}
          variant='contained'
          style={{ '--color': '#F9FAFB', color: 'black' } as React.CSSProperties}
        >
          <Arrow />
          Back
        </ButtonKit>
        <ButtonLoadingKit
          onClick={() => {
            handleSubmitLogin(connect);
          }}
          variant='contained'
          style={{ '--color': platformObj.color }}
          disabled={!(email && password)}
          loading={isLoading}
          className={`connect-account-btn ${!platformObj?.color && 'onboarding-platform-border '} ${
            platformObj.name
          }`}
        >
          <img src={platformObj.srcNoBg} alt={platform} />
          <p className={`onboarding-connect-content ${isLoading && 'loading'}`}>
            Connect with {platform}
          </p>
        </ButtonLoadingKit>
      </div>
    </div>
  );
};

export default ConnectPlatform;
