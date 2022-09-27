import AddIcon from '@mui/icons-material/Add';
import React, { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import ButtonKit from '../../kits/button/ButtonKit';
import PaperKit from '../../kits/paper/PaperKit';
import TextfieldKit from '../../kits/textfield/TextfieldKit';
import TypographyKit from '../../kits/typography/TypographyKit';
import CompetitionDropdown from '../competitionDropdown/CompetitionDropdown';
import './Competitor.scss';
import CountryIcon from '../../assets/images/ic_country.png';
import CityIcon from '../../assets/images/ic_city.png';
import CuisineIcon from '../../assets/images/ic_cuisine.png';
import PlatformIcon from '../../assets/images/ic_select_platform.png';
import LinearProgressKit from '../../kits/linearProgress/LinearProgressKit';

const Competitor = ({ open, opened }) => {
  const [restaurant, setRestaurant] = useState('');
  const [platform, setPlatform] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    const data = {
      restaurant,
      platform,
      area,
      city,
      country,
      cuisineFilter,
    };
    console.log(data);
    setLoading(true);
  };
  const [progress, setProgress] = useState(0);
  const progressBar = () => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          setLoading(false);
          open();
          return 0;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  };
  useEffect(() => {
    if (loading) {
      progressBar();
    }
  }, [loading]);
  return (
    <div className="competitor-wrapper">
      <ButtonKit onClick={() => open()} variant="contained" className="competition-add">
        <AddIcon />
        Add a Competitor
      </ButtonKit>
      <div
        role="presentation"
        tabIndex={-1}
        onClick={() => open()}
        className={`competitor-overlay ${opened ? 'active' : ''}`}>
        <form role="presentation" tabIndex={-1} onSubmit={(e) => submit(e)}>
          <PaperKit onClick={(e) => e.stopPropagation()} className="competitor-paper">
            <CloseIcon onClick={() => open()} className="competitor-close" />
            <TypographyKit className="competitor-top-text">Add a competitor</TypographyKit>
            <TypographyKit className="competitor-top-text-span">
              Proin ut tellus elit nunc, vel, lacinia consectetur condimentum id.
            </TypographyKit>
            {loading ? (
              <div className="progress-bar">
                <LinearProgressKit
                  className="progress-bar-line"
                  variant="determinate"
                  value={progress}
                />
                <TypographyKit className="progress-bar-text">
                  We are processing all data coming from this competitor , their data will be showen
                  in 24h
                </TypographyKit>
              </div>
            ) : (
              <div className="competitor-inputs">
                <TextfieldKit
                  className="competition-textfield"
                  label="Restaurant name"
                  variant="outlined"
                  onChange={(e) => setRestaurant(e.target.value)}
                  required
                />
                <CompetitionDropdown
                  icon={PlatformIcon}
                  select={platform}
                  rows={['talabat', 'deliveroo']}
                  title="Select a Platform"
                  className="competitor-dropdown"
                  setRow={setPlatform}
                />
                <CompetitionDropdown
                  icon={CountryIcon}
                  setRow={setCountry}
                  title="Country"
                  className="competitor-dropdown"
                  rows={['USA', 'Kyrgystan']}
                  select={country}
                />
                <CompetitionDropdown
                  icon={CityIcon}
                  setRow={setCity}
                  title="City"
                  className="competitor-dropdown"
                  rows={['Bishkek', 'New York']}
                  select={city}
                />
                <TextfieldKit
                  className="competition-textfield"
                  label="Area Name"
                  variant="outlined"
                  onChange={(e) => setArea(e.target.value)}
                  required
                />
                <CompetitionDropdown
                  icon={CuisineIcon}
                  title="Cuisine filter"
                  className="competitor-dropdown"
                  setRow={setCuisineFilter}
                  rows={['Sushi', 'Curry']}
                  select={cuisineFilter}
                />
              </div>
            )}
            <div className="competition_btn-wrapper">
              <ButtonKit
                type="submit"
                variant="contained"
                className={`competition-add ${loading ? 'active' : ''}`}>
                Add this competitor
              </ButtonKit>
              <ButtonKit
                onClick={() => {
                  open();
                  setLoading(false);
                }}
                variant="outlined"
                className="competition-cancel">
                Cancel
              </ButtonKit>
            </div>
          </PaperKit>
        </form>
      </div>
    </div>
  );
};

export default Competitor;
