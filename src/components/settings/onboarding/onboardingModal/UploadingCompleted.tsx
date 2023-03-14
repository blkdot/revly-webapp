import { FC } from 'react';
import { ButtonKit } from 'kits';
import { useAtom } from 'jotai';
import { onboardingConnectAccountAtom, onboardingConnectAtom } from 'store/onboardingAtom';
import Arrow from '../../../../assets/icons/Arrow';
import CloseIcon from '../../../../assets/images/ic_close.svg';
import Congrats from '../../../../assets/images/congrats.gif';

const UploadingCompleted: FC<{
  openCloseModal: any;
}> = ({ openCloseModal }) => {
  const [connect] = useAtom(onboardingConnectAtom);
  const [, setConnectAccount] = useAtom(onboardingConnectAccountAtom);
  const platform = connect.charAt(0).toUpperCase() + connect.slice(1);
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
        onClick={() => {
          openCloseModal();
          setConnectAccount('account');
        }}
      />
      <div className='onboarding-congrats'>
        <p className='__title'>Congrats! your {platform} account has been connected</p>
        <img src={Congrats} alt='congrats' />
        <span className='__subtitle'>
          Our team works to process all of the data that has been uploaded. This includes verifying
          the accuracy of the information and making sure that everything is in order
        </span>
      </div>
      <div className='onboarding-platform-buttons account'>
        <ButtonKit
          onClick={() => {
            openCloseModal();
            setConnectAccount('account');
          }}
          variant='contained'
          style={{ '--color': '#F9FAFB', color: 'black' } as React.CSSProperties}
        >
          Close
        </ButtonKit>
        <ButtonKit
          onClick={() => {
            setConnectAccount('account');
          }}
          className='onboarding-platform-buttons_confirm'
          variant='contained'
          style={{ '--color': '#9A6FFF' } as React.CSSProperties}
        >
          Add more platforms <Arrow />
        </ButtonKit>
      </div>
    </div>
  );
};

export default UploadingCompleted;
