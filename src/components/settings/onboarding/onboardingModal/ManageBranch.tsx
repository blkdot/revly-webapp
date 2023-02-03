import { loadUser, saveUser } from 'api/userApi';
import { useUserAuth } from 'contexts/AuthContext';
import CloseIcon from '../../../../assets/images/ic_close.png';
import PauseIcon from '../../../../assets/images/ic_pause.png';
import ResumeIcon from '../../../../assets/images/ic_resume.png';
import TrashIcon from '../../../../assets/images/ic_trash.png';
import { platformList } from '../../../../data/platformList';
import ButtonKit from '../../../../kits/button/ButtonKit';
import Arrow from '../../../../assets/images/arrow.png';

const ManageBranch = ({ propsVariables }) => {
  const { openCloseModal, clickedBranch, setBranchData, branchData, vendors } = propsVariables;
  const getPlatform = (plat) => platformList.find((obj) => obj.name === plat);
  const { user } = useUserAuth();
  const changeStatus = async () => {
    await saveUser({
      access_token: user.accessToken,
      vendors: {
        [clickedBranch.linked_platforms[0].platform]: [
          vendors.vendorsArr.find((objV) => objV.vendor_id === clickedBranch.id),
        ],
      },
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
  const deleteBranch = async () => {
    await saveUser({
      access_token: user.accessToken,
      vendors: {
        [clickedBranch.linked_platforms[0].platform]: [
          vendors.vendorsArr.find((objV) => objV.vendor_id === clickedBranch.id),
        ],
      },
      data: { is_deleted: true },
    });
    branchData.splice(
      branchData.findIndex((obj) => obj.id === clickedBranch.id),
      1
    );
    openCloseModal();
    setBranchData([...branchData]);
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
                <span
                  style={{ '--color': getPlatform(obj.platform).color } as any}
                  className={`render-linked-platforms-row ${obj.status}`}
                >
                  <img
                    src={
                      getPlatform(obj.platform).srcFaviconWhite ||
                      getPlatform(obj.platform).srcFavicon
                    }
                    alt={obj.platform}
                  />
                </span>
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
          <ButtonKit onClick={changeStatus} className='pause' variant='contained'>
            <img src={PauseIcon} alt='pause' /> Suspend activity from this branch
          </ButtonKit>
        ) : (
          <ButtonKit onClick={changeStatus} className='resume' variant='contained'>
            <img src={ResumeIcon} alt='resume' /> Resume activity from this branch
          </ButtonKit>
        )}
        <ButtonKit onClick={deleteBranch} className='delete' variant='outlined'>
          <img src={TrashIcon} alt='trash' /> Delete this branch from Revly
        </ButtonKit>
      </div>
    </div>
  );
};

export default ManageBranch;
