import React, { useState } from 'react';
import Dates from '../../components/dates/Dates';
import RestaurantDropdown from '../../components/restaurantDropdown/RestaurantDropdown';
import PaperKit from '../../kits/paper/PaperKit';
import TypographyKit from '../../kits/typography/TypographyKit';
import './Competition.scss';
import useVendors from '../../hooks/useVendors';
import CompetitionDropdown from '../../components/competitionDropdown/CompetitionDropdown';
import CompetitionTable from '../../components/competitonTable/CompetitionTable';
import Competitor from '../../components/competitor/Competitor';
import PlatformIcon from '../../assets/images/ic_select_platform.png';
import competitorIcon from '../../assets/images/ic_competitor.png';
import { competitionAlertsData } from '../../data/fakeDataCompetition';
import useDate from '../../hooks/useDate';

const CompetitionAlerts = () => {
  const { vendors, vendorsPlatform } = useVendors();
  const [opened, setOpened] = useState(false);
  const [platform, setPlatform] = useState('');
  const [competitor, setCompetitor] = useState('');
  const { dateFromContext: dateFrom } = useDate();
  const [dateFromBtn, setDateFromBtn] = useState({
    startDate: dateFrom.startDate,
    endDate: dateFrom.endDate,
  });
  const Open = () => {
    setOpened(!opened);
    const body = document.querySelector('body');
    if (opened) {
      body.style.overflowY = 'visible';
    } else {
      body.style.overflowY = 'hidden';
    }
  };
  return (
    <div className="wrapper">
      <div className="top-inputs">
        <RestaurantDropdown vendors={vendors} vendorsPlatform={vendorsPlatform} />
        <Dates dateFromBtn={dateFromBtn} setdateFromBtn={setDateFromBtn} />
      </div>
      <TypographyKit sx={{ marginTop: '40px' }} variant="h4">
        Competition - Alerts
      </TypographyKit>
      <TypographyKit variant="subtitle">
        Proin ut tellus elit nunc, vel, lacinia consectetur condimentum id. Cursus magna massa
        vivamus risus.
      </TypographyKit>
      <PaperKit className="competition-paper">
        <div className="competition-top-input alerts-top-inputs">
          <div className="competition-dropdowns">
            <CompetitionDropdown
              rows={['talabat', 'deliveroo']}
              icon={PlatformIcon}
              title="Select a Platform"
              className="top-competition"
              setRow={setPlatform}
              select={platform}
            />
            <CompetitionDropdown
              rows={['1 competitor', '2 competitor']}
              icon={competitorIcon}
              title="Competitor"
              className="top-competition"
              setRow={setCompetitor}
              select={competitor}
            />
          </div>
          <Competitor open={Open} opened={opened} />
        </div>
        <TypographyKit variant="subtitle">
          You can select up to 5 competitors to be monitored per point of sale. Competitors can be
          changed every 3 months
        </TypographyKit>
        <CompetitionTable type="alerts" open={Open} rows={competitionAlertsData} />
      </PaperKit>
    </div>
  );
};

export default CompetitionAlerts;
