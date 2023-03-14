import { saveUser } from 'api/userApi';
import { usePlatform, useUser } from 'contexts';
import { platformList } from 'data/platformList';
import { useAtom } from 'jotai';
import { ButtonKit, TypographyKit } from 'kits';
import { FC } from 'react';
import { vendorsAtom } from 'store/vendorsAtom';
import Arrow from '../../../../assets/images/arrow.svg';
import CloseIcon from '../../../../assets/images/ic_close.svg';
import PauseIcon from '../../../../assets/images/ic_pause.png';
import ResumeIcon from '../../../../assets/images/ic_resume.png';
import TrashIcon from '../../../../assets/images/ic_trash.png';
import SwitchDeleteModal from './SwitchDeleteModal';

const ManageBranch: FC<{
  unremovable: boolean;
  propsVariables: {
    openCloseModal: any;
    clickedBranch: any;
    setBranchData: any;
    branchData: any;
    openSwitchDeleteModal: any;
    setOpenedSwitchDeleteModal: any;
    openedSwitchDeleteModal: any;
    setLoading: any;
    loading: any;
    setConnectAccount: any;
    deleteAccount: any;
  };
}> = ({ propsVariables, unremovable }) => {
  const {
    openCloseModal,
    clickedBranch,
    loading,
    setBranchData,
    branchData,
    openSwitchDeleteModal,
    setOpenedSwitchDeleteModal,
    openedSwitchDeleteModal,
    setLoading,
    setConnectAccount,
    deleteAccount,
  } = propsVariables;
  const getPlatform = (plat: string) => platformList.find((obj) => obj.name === plat);
  const user = useUser();
  const [vendors] = useAtom(vendorsAtom);
  const vendorsBranch = () => {
    const object = {};
    Object.keys(vendors.display).forEach((cName) => {
      Object.keys(vendors.display[cName]).forEach((vName) => {
        Object.keys(vendors.display[cName][vName].platforms).forEach((plat) => {
          if (
            Number(clickedBranch.id) ===
            Number(vendors.display[cName][vName].platforms[plat].vendor_id)
          ) {
            object[plat] = [vendors.display[cName][vName].platforms[plat]];
          }
        });
      });
    });
    return object;
  };

  const { userPlatformData } = usePlatform();
  const deleteBranch = async () => {
    setLoading(true);
    await saveUser({
      access_token: user.token,
      vendors: vendorsBranch(),
      data: { is_deleted: true },
    });
    branchData.splice(
      branchData.findIndex((obj) => obj.id === clickedBranch.id),
      1
    );
    Object.keys(userPlatformData.platforms).forEach((plat) => {
      userPlatformData.platforms[plat].forEach((objP) => {
        if (clickedBranch.accounts.find((email) => email === objP.email)) {
          if (objP.vendor_ids.length === 1) {
            deleteAccount(plat, objP.email);
          }
        }
      });
    });

    openCloseModal();
    setBranchData([...branchData]);
    setLoading(false);
    setOpenedSwitchDeleteModal(!openedSwitchDeleteModal);
  };

  const changeStatusBranch = async () => {
    setLoading(true);
    const clonedBranchData = [...branchData];
    await saveUser({
      access_token: user.token,
      vendors: vendorsBranch(),
      data: {
        is_active: !(
          clickedBranch.branch_status === 'active' || clickedBranch.branch_status === 'in process'
        ),
      },
    });

    if (clickedBranch.branch_status === 'active' || clickedBranch.branch_status === 'in process') {
      clonedBranchData[branchData.findIndex((obj) => obj.id === clickedBranch.id)].branch_status =
        'suspended';
    } else {
      clonedBranchData[branchData.findIndex((obj) => obj.id === clickedBranch.id)].branch_status =
        'active';
    }
    setLoading(false);
    setBranchData([...clonedBranchData]);
    openCloseModal();
  };
  return (
    <div
      className='onboarding-connect-account'
      tabIndex={-1}
      role='presentation'
      onClick={(e) => e.stopPropagation()}
    >
      <SwitchDeleteModal
        loading={loading}
        title='Are you sure you want to delete this branch ?'
        button='Delete this Branch'
        onClick={deleteBranch}
        openSwitchDeleteModal={openSwitchDeleteModal}
        openedSwitchDeleteModal={openedSwitchDeleteModal}
      />
      <img
        className='onboarding-close_icon modal'
        tabIndex={-1}
        role='presentation'
        src={CloseIcon}
        alt='close icon'
        onClick={openCloseModal}
      />
      <div>
        <p className='__title'>Manage your Branch</p>
        <span className='__subtitle'>
          This allows you to enable, disable or delete your Branch , once an branch is disabled or
          deleted, we re gonna stop showing you any data related to it.
        </span>
        <div className='manage-branch-status'>
          <div className='render-branch-row active'>
            <p className='__title'>{clickedBranch.branch_name}</p>
          </div>
          <div
            className={`render-branch_status-row ${clickedBranch.branch_status.replace(/\s/g, '')}`}
          >
            {clickedBranch.branch_status}
          </div>
        </div>
        <div className='manage-branch-accounts_wrapper'>
          {clickedBranch.linked_platforms.map((obj: any, index: number) => (
            <div
              tabIndex={-1}
              role='presentation'
              onClick={() => setConnectAccount('manageAccount')}
              className='manage-branch-accounts'
              key={obj.platform}
            >
              <div>
                <TypographyKit
                  components='span'
                  style={{ '--color': getPlatform(obj.platform).color }}
                  className={`render-linked-platforms-row ${obj.status}`}
                >
                  <img
                    src={getPlatform(obj.platform).srcWhite || getPlatform(obj.platform).src}
                    alt={obj.platform}
                  />
                </TypographyKit>
                <div className='render-accounts-row'>{clickedBranch.accounts[index]}</div>
              </div>
              <div>
                {obj.status === 'active' ? 'Connected' : 'Disconnected'}
                <img src={Arrow} alt='arrow' />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='manage-branch-buttons'>
        {clickedBranch.branch_status === 'active' ? (
          <ButtonKit onClick={changeStatusBranch} className='pause' variant='contained'>
            <img src={PauseIcon} alt='pause' /> Suspend activity from this branch
          </ButtonKit>
        ) : (
          <ButtonKit onClick={changeStatusBranch} className='resume' variant='contained'>
            <img src={ResumeIcon} alt='resume' /> Resume activity from this branch
          </ButtonKit>
        )}
        <ButtonKit
          onClick={openSwitchDeleteModal}
          className='delete'
          variant='outlined'
          disabled={unremovable}
        >
          <img src={TrashIcon} alt='trash' /> Delete this branch from Revly
        </ButtonKit>
      </div>
    </div>
  );
};

export default ManageBranch;
