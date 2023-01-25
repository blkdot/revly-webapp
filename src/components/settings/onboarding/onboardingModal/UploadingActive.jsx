import React from 'react';
import CloseIcon from '../../../../assets/images/ic_close.png';
import ButtonKit from '../../../../kits/button/ButtonKit';
import Arrow from '../../../../assets/icons/Arrow';

const UploadingActive = ({ propsVariables }) => {
  const {
    branchDataUploading,
    setUploading,
    uploading,
    setBranchDataUploading,
    setEmail,
    setPassword,
    setBranchData,
    setActiveStep,
    openCloseModal,
    setAccounts,
    accounts,
    branchData,
    connect,
    email,
    platform,
  } = propsVariables;
  const confirm = () => {
    setUploading({ ...uploading, completed: true });
    setAccounts([...accounts, { platform: connect, connected: true, email }]);
    setEmail('');
    setPassword('');
    const branchDataTemp = [...branchData];
    setBranchData([...branchData, ...branchDataUploading]);
    let step = 100;
    const intervalId = setInterval(() => {
      step += 2;
      setActiveStep(step);
      if (step >= 200) {
        clearInterval(intervalId);
        const newBranchData = branchDataUploading.map((obj) => ({
          ...obj,
          branch_status: 'active',
          branch_name: { ...obj.branch_name, status: 'active' },
          linked_platforms: {
            branch_status: 'active',
            platforms: [{ ...obj.linked_platforms.platforms[0], status: 'active' }],
          },
        }));
        setBranchData([...branchDataTemp, ...newBranchData]);
      }
    }, 250);
  };
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
        <p className="__title">Your Data is Being uploaded</p>
        <span className="__subtitle">
          Your {platform} account has been connect , we are uplouploading the necessary data to
          manage your brands
        </span>
      </div>
      <div className="onboarding-branches-uploading">
        <p className="__title">{branchDataUploading.length} Branches Has been uploaded</p>
        {branchDataUploading.map((obj) => (
          <div key={obj.id}>
            <div>
              <p className="__title">{obj.branch_name.title}</p>
              <span className="__subtitle">{obj.branch_name.address}</span>
            </div>
            <ButtonKit variant="contained">Added</ButtonKit>
          </div>
        ))}
      </div>
      <div className="onboarding-platform-buttons account">
        <ButtonKit
          style={{ '--color': '#F9FAFB', color: 'black' }}
          onClick={() => {
            setUploading({ ...uploading, progress: 0, active: false });
            setBranchDataUploading([]);
          }}
          variant="contained"
        >
          Cancel
        </ButtonKit>
        <ButtonKit
          className="onboarding-platform-buttons_confirm"
          variant="contained"
          style={{ '--color': '#9A6FFF' }}
          onClick={confirm}
        >
          Confirm <Arrow />
        </ButtonKit>
      </div>
    </div>
  );
};

export default UploadingActive;
