import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import ButtonKit from '../../kits/button/ButtonKit';
import PaperKit from '../../kits/paper/PaperKit';
import TextfieldKit from '../../kits/textfield/TextfieldKit';
import TypographyKit from '../../kits/typography/TypographyKit';
import CompetitionDropdown from '../competitionDropdown/CompetitionDropdown';
import './Competitor.scss';

const Competitor = () => {
  const [opened, setOpened] = useState(false);
  const [platform, setPlatform] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState('');
  console.log(platform, area, city, country, cuisineFilter);
  return (
    <div className="competitor-wrapper">
      <div className="competitor-btns-wrapper">
        <AddCircleOutlineIcon onClick={() => setOpened(true)} />
        <ButtonKit onClick={() => setOpened(true)} variant="outlined" className="competitor-btn">
          Add a competitor
        </ButtonKit>
      </div>
      <div
        role="presentation"
        tabIndex={-1}
        onClick={() => setOpened(false)}
        className={`competitor-overlay ${opened ? 'active' : ''}`}>
        <PaperKit onClick={(e) => e.stopPropagation()} className="competitor-paper">
          <CloseIcon onClick={() => setOpened(false)} className="competitor-close" />
          <TypographyKit variant="h4">Add a competitor</TypographyKit>
          <TextfieldKit
            className="competition-textfield"
            label="Restaurant name"
            variant="outlined"
          />
          <CompetitionDropdown
            select={[]}
            rows={['talabat', 'deliveroo']}
            title="Platform"
            className="competition-dropdown"
            setRow={setPlatform}
          />
          <div className="competition-two-small">
            <CompetitionDropdown setRow={setArea} title="Area" className="competition-dropdown" />
            <CompetitionDropdown setRow={setCity} title="City" className="competition-dropdown" />
          </div>
          <CompetitionDropdown
            setRow={setCountry}
            selectWidth={160}
            title="Country"
            className="competition-dropdown"
          />
          <CompetitionDropdown
            selectWidth={160}
            title="Cuisine filter"
            className="competition-dropdown"
            setRow={setCuisineFilter}
          />
          <div className="competition_btn-wrapper">
            <ButtonKit variant="contained">Add</ButtonKit>
          </div>
        </PaperKit>
      </div>
    </div>
  );
};

export default Competitor;
