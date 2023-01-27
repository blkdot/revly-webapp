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
import lines from '../../assets/images/lines.png';
import loadingImage from '../../assets/images/loading-image.png';
import ictalabat from '../../assets/images/talabat-favicon.png';
import icdeliveroo from '../../assets/images/deliveroo-favicon.webp';
import MenuItemKit from '../../kits/menuItem/MenuItemKit';
import ListItemTextKit from '../../kits/listItemtext/ListItemTextKit';
import { sendMail } from '../../api/competitionApi';
import { useUserAuth } from '../../contexts/AuthContext';
import SpinnerKit from '../../kits/spinner/SpinnerKit';
import { useAlert } from '../../hooks/useAlert';
import { settingsLoad } from '../../api/settingsApi';

const Competitor = ({ open, opened, platformList }) => {
  const [restaurant, setRestaurant] = useState('');
  const [platform, setPlatform] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingReq, setLoadingReq] = useState(false);
  const { user } = useUserAuth();
  const { showAlert, setAlertMessage } = useAlert();
  const [userRestoName, setUserRestoName] = useState('');
  const getUserData = async () => {
    try {
      const data = await settingsLoad({
        master_email: user.email,
        access_token: user.accessToken,
      });
      setUserRestoName(data.restoname || '');
    } catch (err) {
      setAlertMessage(err.code);
      showAlert();
    }
  };
  useEffect(() => {
    getUserData();
  }, []);
  const submit = async (e) => {
    e.preventDefault();
    setLoadingReq(true);
    const data = {
      userRestaurant: userRestoName,
      name: restaurant,
      platform,
      country,
      city,
      areaName: area,
      cuisine: cuisineFilter,
    };
    // TODO: fix this code
    // eslint-disable-next-line no-console
    await sendMail({ ...data, emailTo: 'amine@revly.ae' });
    await sendMail({ ...data, emailTo: 'chiekh@revly.ae' });
    setLoading(true);
    setLoadingReq(false);
    setRestaurant('');
    setPlatform('');
    setArea('');
    setCity('');
    setCountry('');
    setCuisineFilter('');
  };

  const render = () => {
    if (loadingReq) {
      return (
        <div className='competitor-loading'>
          <SpinnerKit />
        </div>
      );
    }
    if (loading) {
      return (
        <div className='progress-bar'>
          <img src={loadingImage} alt='Procces' />
          <TypographyKit variant='h5'>Competitor on process</TypographyKit>
          <TypographyKit className='competitor-top-text-span'>
            We are processing your competitor data. You can check your competitor ranking after 24
            hours.
          </TypographyKit>
        </div>
      );
    }
    return (
      <div className='competitor-inputs'>
        <span>Your Competitor data</span>
        <div>
          <TextfieldKit
            className='competition-textfield'
            label='Restaurant name'
            variant='outlined'
            onChange={(e) => setRestaurant(e.target.value)}
            required
          />
          <CompetitionDropdown
            rows={platformList}
            renderOptions={(v) => (
              <MenuItemKit key={v.name} value={v.name}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    textTransform: 'capitalize',
                  }}
                >
                  <img
                    src={v.name === 'deliveroo' ? icdeliveroo : ictalabat}
                    width={24}
                    height={24}
                    style={{ objectFit: 'contain' }}
                    alt='icon'
                  />
                  <ListItemTextKit primary={v.name} />
                </div>
              </MenuItemKit>
            )}
            icon={PlatformIcon}
            title='Platform'
            id='platform_dropdown_menu'
            type='platform'
            className='competitor-dropdown'
            setRow={setPlatform}
            select={platform}
          />
          <CompetitionDropdown
            icon={CountryIcon}
            setRow={setCountry}
            title='Country'
            className='competitor-dropdown'
            rows={['UAE', 'Kuwait', 'Qatar']}
            select={country}
          />
          <CompetitionDropdown
            icon={CityIcon}
            setRow={setCity}
            title='City'
            className='competitor-dropdown'
            rows={['Dubai', 'Sharjah', 'Abu Dhabi', 'Kuwait City', 'Doha']}
            select={city}
          />
          <TextfieldKit
            className='competition-textfield'
            label='Area Name'
            variant='outlined'
            onChange={(e) => setArea(e.target.value)}
            required
          />
          <CompetitionDropdown
            icon={CuisineIcon}
            title='Cuisine filter'
            className='competitor-dropdown'
            setRow={setCuisineFilter}
            rows={['Italian', 'Burgers', 'Pizza', 'Sushi', 'Indian']}
            select={cuisineFilter}
          />
        </div>
      </div>
    );
  };

  return (
    <div className='competitor-wrapper'>
      <ButtonKit onClick={() => open()} variant='contained' className='competition-add'>
        <AddIcon />
        Add a Competitor
      </ButtonKit>
      <div
        role='presentation'
        tabIndex={-1}
        onClick={() => open()}
        className={`competitor-overlay ${opened ? 'active' : ''}`}
      >
        <form role='presentation' tabIndex={-1} onSubmit={(e) => submit(e)}>
          <PaperKit onClick={(e) => e.stopPropagation()} className='competitor-paper'>
            <div style={{ height: '100%' }}>
              <CloseIcon onClick={() => open()} className='competitor-close' />
              <img className='competitor-lines' src={lines} alt='Lines' />
              <TypographyKit className='competitor-top-text'>Add a competitor</TypographyKit>
              {render()}
            </div>
            <div className='competition_btn-wrapper'>
              <ButtonKit
                type='submit'
                variant='contained'
                className={`competition-add ${loading ? 'active' : ''}`}
              >
                Add this competitor
              </ButtonKit>
              <ButtonKit
                onClick={() => {
                  open();
                  setLoading(false);
                }}
                variant='outlined'
                className='competition-cancel'
              >
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
