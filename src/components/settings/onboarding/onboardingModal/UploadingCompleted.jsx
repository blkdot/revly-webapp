import React from 'react';
import ButtonKit from '../../../../kits/button/ButtonKit';
import CloseIcon from '../../../../assets/images/ic_close.png';
import Congrats from '../../../../assets/images/congrats.png';

const UploadingCompleted = ({ propsVariables }) => {
  const { openCloseModal, setConnect, setUploading, platform } = propsVariables;
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
        onClick={() => {
          openCloseModal();
          setUploading({ active: false, progress: 0, completed: false });
        }}
      />
      <div className="onboarding-congrats">
        <p className="__title">Congrats! your {platform} account has been connected</p>
        <img src={Congrats} alt="congrats" />
        <span className="__subtitle">
          Our team works to process all of the data that has been uploaded. This includes verifying
          the accuracy of the information and making sure that everything is in order
        </span>
      </div>
      <div className="onboarding-platform-buttons account">
        <ButtonKit
          onClick={() => {
            openCloseModal();
            setUploading({ active: false, progress: 0, completed: false });
            setConnect('');
          }}
          variant="contained"
          style={{ '--color': '#F9FAFB', color: 'black' }}
        >
          Close
        </ButtonKit>
      </div>
    </div>
  );
};

export default UploadingCompleted;
