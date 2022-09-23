import React from 'react';
import CompetitionDropdown from '../../components/competitionDropdown/CompetitionDropdown';
import CompetitionTableBottom from '../../components/competitonTable/CompetitionTableBottom';
import CompetitionTableTop from '../../components/competitonTable/CompetitionTableTop';
import Competitor from '../../components/competitor/Competitor';
import Dates from '../../components/dates/Dates';
import RestaurantDropdown from '../../components/restaurantDropdown/RestaurantDropdown';
import { restaurantNames } from '../../data/fakeDataDashboard';
import TypographyKit from '../../kits/typography/TypographyKit';
import './Competition.scss';

const Competition = () => (
  <div className="wrapper">
    <div className="top-inputs">
      <RestaurantDropdown names={restaurantNames} />
      <Dates />
    </div>
    <div className="competition-top">
      <CompetitionDropdown select={[]} rows={['talabat', 'deliveroo']} title="Platform" />
      <Competitor />
    </div>
    <TypographyKit className="competition-top-text" variant="h5">
      You can select up to 5 competitors to be monitored per point of sale. Competitors can be
      changed every 3 months
    </TypographyKit>
    <CompetitionTableTop rows={[]} />
    <TypographyKit className="competition-bottom-text" variant="h5">
      You have selected 3 competitors. You have 2 competitors remaining.
    </TypographyKit>
    <CompetitionTableBottom rows={[]} />
  </div>
);

export default Competition;
