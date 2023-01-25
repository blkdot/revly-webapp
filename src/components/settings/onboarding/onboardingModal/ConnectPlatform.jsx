import React from 'react';
import ButtonKit from '../../../../kits/button/ButtonKit';
import CloseIcon from '../../../../assets/images/ic_close.png';
import TextfieldKit from '../../../../kits/textfield/TextfieldKit';
import Arrow from '../../../../assets/icons/Arrow';
import LodaingButtonKit from '../../../../kits/loadingButton/LoadingButtonKit';

const ConnectPlatform = ({ propsVariables }) => {
  const {
    openCloseModal,
    connect,
    setEmail,
    setPassword,
    email,
    password,
    setConnect,
    setUploading,
    setBranchDataUploading,
    uploading,
    isLoading,
    platform,
    platformObj,
  } = propsVariables;
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
        <p className="__title">Connect to your {platform} Account</p>
        <span className="__subtitle">
          Use your {platform} Email and password to connect your account
        </span>
        <TextfieldKit
          className="onboarding-textfield"
          placeholder="Email Address"
          onChange={({ target }) => setEmail(target.value)}
          value={email}
        />
        <TextfieldKit
          className="onboarding-textfield"
          placeholder="Password"
          onChange={({ target }) => setPassword(target.value)}
          value={password}
        />
      </div>
      <div className="onboarding-platform-buttons account">
        <ButtonKit
          onClick={() => {
            setConnect('');
            setEmail('');
            setPassword('');
          }}
          variant="contained"
          style={{ '--color': '#F9FAFB', color: 'black' }}
        >
          <Arrow />
          Back
        </ButtonKit>
        <LodaingButtonKit
          onClick={() => {
            setUploading({ ...uploading, active: true });
            const arr = [];
            for (let i = 0; i < 10; i++) {
              arr.push({
                branch_name: {
                  title: `THE KITCHEN - Allentown ${i}`,
                  address: '4140 Parker Rd. Allentown, New Mexico 31134',
                  status: 'in process',
                },
                accounts: { status: 'in process', emails: [email] },
                linked_platforms: {
                  branchStatus: 'in process',
                  platforms: [{ platform: connect, status: 'in process' }],
                },
                branch_status: 'in process',
                id: i,
              });
            }
            setBranchDataUploading([...arr]);
          }}
          variant="contained"
          style={{ '--color': platformObj.color }}
          loading={isLoading}
          disabled={!(email && password)}
        >
          <img src={platformObj.srcFaviconWhite || platformObj.srcFavicon} alt={platform} />
          Connect with {platform}
        </LodaingButtonKit>
      </div>
    </div>
  );
};

export default ConnectPlatform;
