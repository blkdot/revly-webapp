import { FC, useState } from 'react';
import { TypographyKit, SwitchKit } from 'kits';
import { platformList } from 'data/platformList';
import SwitchDeleteModal from './SwitchDeleteModal';
import TrashIcon from '../../../../assets/images/ic_trash.png';
import CloseIcon from '../../../../assets/images/ic_close.svg';

const ManageAccount: FC<{
  propsVariables: {
    openCloseModal: any;
    accounts: any;
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
        {accounts.map((obj, index) => (
          <div key={`${obj.platform}-${obj.email}`} className={`onboarding-account ${obj.active ? 'connected' : ''}`}>
            <div>
              <TypographyKit
                components='span'
                className='onboarding-account_platform-logo'
                style={{
                  '--color': platformList.find((objP) => objP.name === obj.platform).color,
                }}
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

export default ManageAccount;
