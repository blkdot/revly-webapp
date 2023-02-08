import { FC } from 'react';
import { TypographyKit, SwitchKit } from 'kits';
import { platformList } from 'data/platformList';
import TrashIcon from '../../../../assets/images/ic_trash.png';
import CloseIcon from '../../../../assets/images/ic_close.png';

const ManageAccount: FC<{
  propsVariables: {
    openCloseModal: any;
    accounts: any;
    deleteAccount: any;
    changeStatusAccount: any;
  };
}> = ({ propsVariables }) => {
  const { openCloseModal, accounts, deleteAccount, changeStatusAccount } = propsVariables;
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
        {accounts.map((obj) => (
          <div key={obj.email} className={`onboarding-account ${obj.active ? 'connected' : ''}`}>
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
                onClick={() => deleteAccount(obj.platform, obj.email)}
                className='onboarding-account_trash-icon'
              >
                <img src={TrashIcon} alt='trash' />
              </span>
              <div className='onboarding-account_switch'>
                <p>{obj.active ? 'Connected' : 'Disconnected'}</p>
                <SwitchKit onChange={() => changeStatusAccount(obj)} checked={obj.active} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageAccount;
