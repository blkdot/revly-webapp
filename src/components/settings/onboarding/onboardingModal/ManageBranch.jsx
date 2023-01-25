import React from 'react';
import CloseIcon from '../../../../assets/images/ic_close.png';
import PauseIcon from '../../../../assets/images/ic_pause.png';
import TrashIcon from '../../../../assets/images/ic_trash.png';
import { platformList } from '../../../../data/platformList';
import ButtonKit from '../../../../kits/button/ButtonKit';
import Arrow from '../../../../assets/images/arrow.png';

const ManageBranch = ({ propsVariables }) => {
  const { openCloseModal, clickedBranch } = propsVariables;
  const getPlatform = (plat) => platformList.find((obj) => obj.name === plat);
  return (
    <div
      className="onboarding-connect-account"
      tabIndex={-1}
      role="presentation"
      onClick={(e) => e.stopPropagation()}
    >
      <img
        className="onboarding-close_icon modal"
        tabIndex={-1}
        role="presentation"
        src={CloseIcon}
        alt="close icon"
        onClick={openCloseModal}
      />
      <div>
        <p className="__title">Manage your Branch</p>
        <span className="__subtitle">
          This allows you to enable, disable or delete your Branch , once an branch is disabled or
          deleted, we re gonna stop showing you any data related to it.
        </span>
        <div className="manage-branch-status">
          <div className="render-branch-row active">
            <p className="__title">{clickedBranch.branch_name.title}</p>
            <span className="__subtitle">{clickedBranch.branch_name.address}</span>
          </div>
          <div className="render-branch_status-row active">{clickedBranch.branch_status}</div>
        </div>
        <div className="manage-branch-accounts_wrapper">
          {clickedBranch.linked_platforms.map((obj, index) => (
            <div className="manage-branch-accounts" key={obj.platform}>
              <div>
                <span
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
                </span>
                <div className="render-accounts-row">{clickedBranch.accounts[index]}</div>
              </div>
              <div>
                {obj.status === 'active' ? 'Connected' : ''}
                <img src={Arrow} alt="arrow" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="manage-branch-buttons">
        <ButtonKit className="pause" variant="contained">
          <img src={PauseIcon} alt="pause" /> Suspend activity from this branch
        </ButtonKit>
        <ButtonKit className="delete" variant="outlined">
          <img src={TrashIcon} alt="trash" /> Delete this branch from Revly
        </ButtonKit>
      </div>
    </div>
  );
};

export default ManageBranch;
