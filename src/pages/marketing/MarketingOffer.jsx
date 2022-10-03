import React, { useState } from 'react';
import CloseIcon from '../../assets/images/ic_close.png';
import Dates from '../../components/dates/Dates';
import RestaurantDropdown from '../../components/restaurantDropdown/RestaurantDropdown';
import { restaurantNames } from '../../data/fakeDataDashboard';
import ButtonKit from '../../kits/button/ButtonKit';
import TypographyKit from '../../kits/typography/TypographyKit';
import './Marketing.scss';
import SmartRuleBtnIcon from '../../assets/images/ic_sm-rule.png';
import SettingFuture from '../../assets/images/ic_setting-future.png';
import PaperKit from '../../kits/paper/PaperKit';
import ContainerKit from '../../kits/container/ContainerKit';
import BoxKit from '../../kits/box/BoxKit';
import LinearProgressKit from '../../kits/linearProgress/LinearProgressKit';
import CompetitionDropdown from '../../components/competitionDropdown/CompetitionDropdown';
import PlatformIcon from '../../assets/images/ic_select_platform.png';

const MarketingOffer = () => {
  const [active, setActive] = useState(false);
  const [progress, setProgress] = useState(33.33);
  const [platform, setPlatform] = useState('');
  const [links, setLinks] = useState(false);

  return (
    <div className="wrapper">
      <div className="top-inputs">
        <RestaurantDropdown names={restaurantNames} />
        <Dates />
      </div>
      <div className="marketing-top">
        <div className="marketing-top-text">
          <TypographyKit variant="h4">Marketing - Offers</TypographyKit>
          <TypographyKit color="#637381" variant="subtitle">
            Proin ut tellus elit nunc, vel, lacinia consectetur condimentum id.
          </TypographyKit>
        </div>
        <div className="markting-top-btns">
          <ButtonKit className="sm-rule-btn" variant="outlined">
            <img src={SmartRuleBtnIcon} alt="Smart rule icon" />
            Create a smart rule
          </ButtonKit>
          <ButtonKit onClick={() => setActive(true)} variant="contained">
            <img src={SettingFuture} alt="Setting future icon" />
            Set up an offer
          </ButtonKit>
        </div>
      </div>
      <div className={`marketing-setup-offer${active ? ' active ' : ''}`}>
        <PaperKit className="marketing-paper">
          <ContainerKit>
            <div className="left-part">
              <div className="left-part-top">
                <div>
                  <TypographyKit onClick={() => setProgress(66.66)} variant="h4">
                    Set up an offer
                  </TypographyKit>
                  <img src={CloseIcon} alt="close icon" />
                </div>
                <BoxKit className="progress-bar" sx={{ display: 'flex', alignItems: 'center' }}>
                  <BoxKit sx={{ width: '100%', mr: 1 }}>
                    <LinearProgressKit variant="determinate" value={progress} />
                  </BoxKit>
                  <BoxKit sx={{ minWidth: 35 }}>
                    <TypographyKit variant="body2" color="text.secondary">{`${Math.round(
                      progress / 33,
                    )} / 3`}</TypographyKit>
                  </BoxKit>
                </BoxKit>
              </div>
              <div className="left-part-middle">
                <TypographyKit variant="h4">1.Select platform and branches</TypographyKit>
                <TypographyKit sx={{ fontSize: '18px' }} color="#637381" variant="subtitle">
                  Proin ut tellus elit nunc, vel, lacinia consectetur condimentum id.
                </TypographyKit>
                <CompetitionDropdown
                  rows={['talabat', 'deliveroo']}
                  icon={PlatformIcon}
                  title="Select a Platform"
                  className="top-competition"
                  setRow={setPlatform}
                  select={platform}
                />
                <CompetitionDropdown
                  rows={['talabat', 'deliveroo']}
                  icon={PlatformIcon}
                  title="Select a Platform"
                  className="top-competition"
                  setRow={setPlatform}
                  select={platform}
                />
              </div>
              <div className="left-part-bottom">
                <ButtonKit variant="outlined" disabled>
                  Previous Step
                </ButtonKit>
                <ButtonKit variant="contained">Next Step</ButtonKit>
              </div>
            </div>
            <div className="right-part">
              <div className="right-part-header">
                <TypographyKit
                  className={`right-part-header_link ${links ? 'active' : ''}`}
                  variant="div">
                  <BoxKit className={links ? 'active' : ''} onClick={() => setLinks(false)}>
                    <img src={PlatformIcon} alt="platform icon" />
                    Orders Heat Map
                  </BoxKit>
                  <BoxKit className={links ? 'active' : ''} onClick={() => setLinks(true)}>
                    <img src={PlatformIcon} alt="platform icon" />
                    Revenue Heat Map
                  </BoxKit>
                </TypographyKit>
                <Dates />
              </div>
              <TypographyKit variant="div" className="right-part-main">
                <TypographyKit className="right-part-main-title" variant="div">
                  <TypographyKit variant="h5">
                    Max Revenue this week
                    <TypographyKit variant="span">$26,213.89</TypographyKit>
                  </TypographyKit>
                  <TypographyKit variant="h5">
                    Min Revenue this week
                    <TypographyKit variant="span">$5,213.98</TypographyKit>
                  </TypographyKit>
                </TypographyKit>
              </TypographyKit>
            </div>
          </ContainerKit>
        </PaperKit>
      </div>
    </div>
  );
};

export default MarketingOffer;
