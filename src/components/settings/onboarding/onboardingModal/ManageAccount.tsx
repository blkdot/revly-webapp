import { FC, useState, useEffect } from 'react';
import { TypographyKit, SwitchKit, TooltipKit } from 'kits';
import { platformObject } from 'data/platformList';
import { useAtom } from 'jotai';
import { onboardingAccountsAtom, onboardingLoadingAtom } from 'store/onboardingAtom';
import SwitchDeleteModal from './SwitchDeleteModal';
import TrashIcon from '../../../../assets/images/ic_trash.png';
import CloseIcon from '../../../../assets/images/ic_close.svg';

const ManageAccount: FC<{
  openCloseModal: () => void;
  deleteAccount: (platform: string, email: string) => void;
  changeStatusAccount: (value: any) => void;
  openSwitchDeleteModal: (event: any) => void;
  openedSwitchDeleteModal: boolean;
}> = ({
  openCloseModal,
  deleteAccount,
  changeStatusAccount,
  openSwitchDeleteModal,
  openedSwitchDeleteModal,
}) => {
  const [accounts] = useAtom(onboardingAccountsAtom);
  const [loading] = useAtom(onboardingLoadingAtom);

  const [selected, setSelected] = useState('');
  const [deleteObj, setDeleteObj] = useState(null);
  const [switchObj, setSwitchObj] = useState(null);

  const renderModalBySelection = () => {
    if (selected === 'delete')
      return (
        <SwitchDeleteModal
          loading={loading}
          title='Are you sure you want to delete this account ?'
          button='Delete this Account'
          onClick={() => deleteAccount(deleteObj.platform, deleteObj.email)}
          openSwitchDeleteModal={openSwitchDeleteModal}
          openedSwitchDeleteModal={openedSwitchDeleteModal}
        />
      );
    if (selected === 'switch')
      return (
        <SwitchDeleteModal
          loading={loading}
          title='Are you sure you want to change status this account ?'
          button='Change Status'
          onClick={() => changeStatusAccount(switchObj)}
          openSwitchDeleteModal={openSwitchDeleteModal}
          openedSwitchDeleteModal={openedSwitchDeleteModal}
        />
      );

    return null;
  };

  const handleClickDelete = (obj) => (e) => {
    openSwitchDeleteModal(e);
    setSelected('delete');
    setDeleteObj(obj);
  };
  const [hover, setHover] = useState([]);
  const compareSize = () => {
    const textElement = document.querySelectorAll('.onboarding-account__email');
    const compareArr = [];
    textElement.forEach((el) => {
      if (el?.scrollWidth > el.clientWidth) {
        compareArr.push(el.textContent);
      }
    });
    setHover(compareArr);
  };
  useEffect(() => {
    compareSize();
    window.addEventListener('resize', compareSize);
  }, []);

  useEffect(
    () => () => {
      window.removeEventListener('resize', compareSize);
    },
    []
  );
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
          <div
            key={`${obj.platform}-${obj.email}`}
            className={`onboarding-account ${obj.active && 'connected'}`}
          >
            <div>
              <TypographyKit
                components='span'
                className='onboarding-account_platform-logo'
                style={{
                  '--color': platformObject[obj.platform].color,
                }}
              >
                <img
                  src={
                    platformObject[obj.platform].srcNoBg ||
                    platformObject[obj.platform].srcWhite ||
                    platformObject[obj.platform].src
                  }
                  alt={obj.platform}
                />
              </TypographyKit>
              <TooltipKit
                placement='right'
                arrow
                id='account-tooltip'
                interactive={1}
                disableHoverListener={!hover.includes(obj.email)}
                title={obj.email}
              >
                <p className='onboarding-account__email'>{obj.email}</p>
              </TooltipKit>
            </div>
            <div>
              <span
                tabIndex={-1}
                role='button'
                onKeyDown={handleClickDelete(obj)}
                onClick={handleClickDelete(obj)}
                className='onboarding-account_trash-icon'
              >
                <img src={TrashIcon} alt='trash' />
              </span>
              <div className='onboarding-account_switch'>
                <p>{obj.active ? 'Connected' : 'Disconnected'}</p>
                <SwitchKit
                  onChange={(e) => {
                    openSwitchDeleteModal(e);
                    setSelected('switch');
                    setSwitchObj(obj);
                  }}
                  checked={obj.active}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      {renderModalBySelection()}
    </div>
  );
};

export default ManageAccount;
