import { FC, useState } from 'react';
import { saveUser } from 'api/userApi';
import { useUserAuth } from 'contexts/AuthContext';
import { TypographyKit, ButtonKit, ModalKit } from 'kits';
import { platformList } from 'data/platformList';
import TrashIcon from '../../../../assets/images/ic_trash.png';
import CloseIcon from '../../../../assets/images/ic_close.png';
import PauseIcon from '../../../../assets/images/ic_pause.png';
import ResumeIcon from '../../../../assets/images/ic_resume.png';
import Arrow from '../../../../assets/images/arrow.png';
import SwitchDeleteModal from './SwitchDeleteModal';

const ManageBranch: FC<{
  propsVariables: {
    openCloseModal: any;
    clickedBranch: any;
    setBranchData: any;
    branchData: any;
    vendors: any;
    openSwitchDeleteModal: any;
    setOpenedSwitchDeleteModal: any;
   openedSwitchDeleteModal: any;
  };
}> = ({ propsVariables }) => {
  const { openCloseModal, clickedBranch, setBranchData, branchData, vendors, openSwitchDeleteModal, setOpenedSwitchDeleteModal, openedSwitchDeleteModal } = propsVariables;
  const getPlatform = (plat: string) => platformList.find((obj) => obj.name === plat);
  const { user } = useUserAuth();

  const vendorsBranch = () => {
    const object = {};
    Object.keys(vendors.display).forEach((cName) => {
      Object.keys(vendors.display[cName]).forEach((vName) => {
        Object.keys(vendors.display[cName][vName].platforms).forEach((plat) => {
          if (
            clickedBranch.accounts.find(
              (email: string) => email === vendors.display[cName][vName].platforms[plat].email
            )
          ) {
            object[plat] = [vendors.display[cName][vName].platforms[plat]];
          }
        });
      });
    });
    return object;
  };
  const deleteBranch = async () => {
    await saveUser({
      access_token: user.accessToken,
      vendors: vendorsBranch(),
      data: { is_deleted: true },
    });
    branchData.splice(
      branchData.findIndex((obj) => obj.id === clickedBranch.id),
      1
    );
    openCloseModal();
    setBranchData([...branchData]);
  };
  const changeStatusBranch = async () => {
    await saveUser({
      access_token: user.accessToken,
      vendors: vendorsBranch(),
      data: {
        is_active: !(
          clickedBranch.branch_status === 'active' || clickedBranch.branch_status === 'in process'
        ),
      },
    });
    if (clickedBranch.branch_status === 'active' || clickedBranch.branch_status === 'in process') {
      branchData[branchData.findIndex((obj) => obj.id === clickedBranch.id)].branch_status =
        'suspended';
    } else {
      branchData[branchData.findIndex((obj) => obj.id === clickedBranch.id)].branch_status =
        'active';
    }
    setBranchData([...branchData]);
  };
  return (
    <div
      className='onboarding-connect-account'
      tabIndex={-1}
      role='presentation'
      onClick={(e) => e.stopPropagation()}
    >
      <SwitchDeleteModal onClick={deleteBranch} openSwitchDeleteModal={openSwitchDeleteModal} openedSwitchDeleteModal={openedSwitchDeleteModal} setOpenedSwitchDeleteModal={setOpenedSwitchDeleteModal} />
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
            <p className='__title'>{clickedBranch.branch_name.title}</p>
            <span className='__subtitle'>{clickedBranch.branch_name.address}</span>
          </div>
          <div
            className={`render-branch_status-row ${clickedBranch.branch_status.replace(/\s/g, '')}`}
          >
            {clickedBranch.branch_status}
          </div>
        </div>
        <div className='manage-branch-accounts_wrapper'>
          {clickedBranch.linked_platforms.map((obj, index) => (
            <div className='manage-branch-accounts' key={obj.platform}>
              <div>
                <TypographyKit
                  components='span'
                  style={{ '--color': getPlatform(obj.platform).color }}
                  className={`render-linked-platforms-row ${obj.status}`}
                >
                  <img
                    src={
                      getPlatform(obj.platform).srcFaviconWhite ||
                      getPlatform(obj.platform).srcFavicon
                    }
                    alt={obj.platform}
                  />
                </TypographyKit>
                <div className='render-accounts-row'>{clickedBranch.accounts[index]}</div>
              </div>
              <div>
                {obj.status === 'active' ? 'Connected' : ''}
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
        <ButtonKit onClick={openSwitchDeleteModal} className='delete' variant='outlined'>
          <img src={TrashIcon} alt='trash' /> Delete this branch from Revly
        </ButtonKit>
      </div>
    </div>
  );
};

export default ManageBranch;
