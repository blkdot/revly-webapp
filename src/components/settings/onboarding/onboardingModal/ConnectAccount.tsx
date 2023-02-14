import { FC, useState } from 'react';
import { platformList } from 'data/platformList';
import { TypographyKit } from 'kits';
import TrashIcon from '../../../../assets/images/ic_trash.png';
import SwitchKit from '../../../../kits/switch/SwitchKit';
import ButtonKit from '../../../../kits/button/ButtonKit';
import CloseIcon from '../../../../assets/images/ic_close.svg';
import SwitchDeleteModal from './SwitchDeleteModal';

const ConnectAccount: FC<{
  propsVariables: {
    openCloseModal: any;
    accounts: any;
    setConnect: any;
    setConnectAccount: any;
    deleteAccount: any;
    changeStatusAccount: any;
    openSwitchDeleteModal: any;
    openedSwitchDeleteModal: any;
    loading: any;
  };
}> = ({ propsVariables }) => {
  const {
    openCloseModal,
    accounts,
    setConnect,
    setConnectAccount,
    deleteAccount,
    changeStatusAccount,
    openSwitchDeleteModal,
    openedSwitchDeleteModal,
    loading,
  } = propsVariables;
  const [selected, setSelected] = useState('');
  const [opened, setOpened] = useState(0);

  return (
    <div tabIndex={-1} role='presentation' onClick={(e) => e.stopPropagation()}>
      <img
        className='onboarding-close_icon modal'
        tabIndex={-1}
        role='presentation'
        src={CloseIcon}
        alt='close icon'
        onClick={openCloseModal}
      />
      <p className='__title'>Connect your Accounts</p>
      <span className='__subtitle'>
        This allows for easy access to important information and ensures that all necessary data are
        uploaded and stored securely.
      </span>
      <div className={`onboarding-platform-buttons ${accounts.length <= 0 ? 'active' : ''}`}>
        {platformList.map((obj) => (
          <ButtonKit
            onClick={() => {
              setConnect(obj.name);
              setConnectAccount('platform');
            }}
            variant='contained'
            key={obj.name}
            style={{ '--color': obj.color } as React.CSSProperties}
          >
            <img src={obj.srcFaviconWhite || obj.srcFavicon} alt={obj.name} />
            Connect with {obj.name.charAt(0).toUpperCase() + obj.name.slice(1)}
          </ButtonKit>
        ))}
      </div>
      {accounts.length > 0 ? (
        <div>
          <p className='__title'>Manage your connected accounts</p>
          <span className='__subtitle'>
            This allows you to enable, disable or delete your connected accounts , once an account
            is delated the brands and branches associated to it will be removed .
          </span>
        </div>
      ) : (
        ''
      )}
      <div className='onboarding-accounts_wrapper'>
        {accounts.map((obj: any, index: number) => (
          <div key={`${obj.platform}-${obj.email}`} className={`onboarding-account ${obj.active ? 'connected' : ''}`}>
            <div>
              <TypographyKit
                components='span'
                className='onboarding-account_platform-logo'
                style={
                  {
                    '--color': platformList.find((objP) => objP.name === obj.platform).color,
                  }
                }
              >
                <img
                  src={
                    platformList.find((objP) => objP.name === obj.platform).srcFaviconWhite ||
                    platformList.find((objP) => objP.name === obj.platform).srcFavicon
                  }
                  alt={obj.platform}
                />
              </TypographyKit>
              <p>{obj.email}</p>
            </div>
            <div>
              <span
                tabIndex={-1}
                role='presentation'
                onClick={(e) => {
                  openSwitchDeleteModal(e);
                  setSelected('delete');
                }}
                className='onboarding-account_trash-icon'
              >
                <img src={TrashIcon} alt='trash' />
                {selected === 'delete' ? (
                  <SwitchDeleteModal
                    loading={loading}
                    title='Are you sure you want to delete this account ?'
                    button='Delete this Account'
                    onClick={() => deleteAccount(obj.platform, obj.email)}
                    openSwitchDeleteModal={openSwitchDeleteModal}
                    openedSwitchDeleteModal={openedSwitchDeleteModal}
                  />
                ) : (
                  ''
                )}
              </span>
              <div className='onboarding-account_switch'>
                <p>{obj.active ? 'Connected' : 'Disconnected'}</p>
                <SwitchKit
                  onChange={(e) => {
                    openSwitchDeleteModal(e);
                    setSelected('switch');
                    setOpened(index);
                  }}
                  checked={obj.active}
                />
                {selected === 'switch' ? (
                  <SwitchDeleteModal
                    loading={loading}
                    title='Are you sure you want to change status this account ?'
                    button='Change Status'
                    onClick={() => changeStatusAccount(obj)}
                    openSwitchDeleteModal={openSwitchDeleteModal}
                    openedSwitchDeleteModal={openedSwitchDeleteModal && opened === index}
                  />
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConnectAccount;
