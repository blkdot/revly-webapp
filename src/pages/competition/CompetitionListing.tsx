import AddIcon from '@mui/icons-material/Add';
import RestaurantDropdown from 'components/restaurantDropdown/RestaurantDropdown';
import TableRevlyNew from 'components/tableRevly/TableRevlyNew';
import { useUserAuth } from 'contexts';
import { subDays } from 'date-fns';
import dayjs from 'dayjs';
import { useAlert, useApi, usePlatform } from 'hooks';
import { useAtom } from 'jotai';
import { ButtonKit, ListItemTextKit, MenuItemKit, PaperKit, TypographyKit } from 'kits';
import { useEffect, useState } from 'react';
import sortedVendors from 'components/restaurantDropdown/soretedVendors';
import selectedVendors from 'components/restaurantDropdown/selectedVendors';
import icdeliveroo from '../../assets/images/deliveroo-favicon.webp';
import AreaIcon from '../../assets/images/ic_area.png';
import PlatformIcon from '../../assets/images/ic_select_platform.png';
import TimeSlotIcon from '../../assets/images/ic_timeslot.png';
import Iccuisine from '../../assets/images/ic_cuisine.png';
import ictalabat from '../../assets/images/talabat-favicon.png';
import CompetitionDropdown from '../../components/competitionDropdown/CompetitionDropdown';
import Competitor from '../../components/competitor/Competitor';
import Dates from '../../components/dates/Dates';
import useTableContentFormatter from '../../components/tableRevly/tableContentFormatter/useTableContentFormatter';
import { vendorsAtom } from '../../store/vendorsAtom';
import './Competition.scss';

let fnDelays = null;
let fnDelaysAreas = null;
let fnDelaysCuisine = null;

const timeSlotObj = {
  'Throughout Day': 'Throughout Day',
  'Breakfast (04:00 - 11:00)': 'Breakfast',
  'Lunch (11:00 - 14:00)': 'Lunch',
  'Interpeak (14:00 - 17:00)': 'Interpeak',
  'Dinner (17:00 - 00:00)': 'Dinner',
  'Late night (00:00 - 04:00)': 'Late Night',
};

const headersAlert = (cuisine: string) => [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Competitor',
  },
  {
    id: 'discount_type',
    numeric: false,
    disablePadding: true,
    label: 'Listing in "Offers"',
  },
  {
    id: 'cuisine',
    numeric: false,
    disablePadding: true,
    label: `Listing in "${cuisine ? `${cuisine} Cuisine` : 'Cuisine'}"`,
  },
  {
    id: 'cuisine_and_discount_type',
    numeric: false,
    disablePadding: true,
    label: `Listing in "Offers"x"${cuisine ? `${cuisine} Cuisine` : 'Cuisine'}"`,
  },
];

const CompetitionListing = () => {
  const [vendors] = useAtom(vendorsAtom);
  const { display } = vendors;
  const [opened, setOpened] = useState(false);
  const [platformList, setPlatformList] = useState([]);
  const [platform, setPlatform] = useState('deliveroo');
  const [area, setArea] = useState('Everywhere');
  const [timeSlot, setTimeSlot] = useState('Throughout Day');
  const [loading, setLoading] = useState(false);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [loadingCuisines, setLoadingCuisines] = useState(false);
  const [competitionListingData, setCompetitionListingData] = useState([]);
  const [cuisine, setCuisine] = useState('');
  const { triggerAlertWithMessageError } = useAlert();
  const [beforePeriodBtn, setbeforePeriodBtn] = useState({
    startDate: subDays(new Date(), 1),
    endDate: subDays(new Date(), 1),
  });
  const [queue, setQueue] = useState(0);
  const [queueAreas, setQueueAreas] = useState(0);
  const [queueCuisines, setQueueCuisines] = useState(0);
  const { getRanking, getAreas, getCuisines } = useApi();
  const { user } = useUserAuth();
  const { userPlatformData } = usePlatform();
  const [areasData, setAreasData] = useState([]);
  const [cuisinesData, setCuisinesData] = useState([]);
  const [vendorsData, setVendorsData] = useState(JSON.parse(JSON.stringify(vendors)));

  const Open = () => {
    setOpened(!opened);
    const body = document.querySelector('body');
    if (opened) {
      body.style.overflowY = 'visible';
    } else {
      body.style.overflowY = 'hidden';
    }
  };

  const getNumArr = () => {
    const numArr = [];
    for (let i = 0; i < 5 - competitionListingData.length; i++) {
      numArr.push(i);
    }
    return numArr;
  };

  useEffect(() => {
    if (userPlatformData) {
      const pl = userPlatformData.platforms;
      const list = Object.keys(pl)
        .map((v) => ({
          name: v,
          registered: pl[v].some((obj) => obj.active),
        }))
        .filter((k) => k.registered === true);

      setPlatform(list[0]?.name);
      setPlatformList(list);
    }
  }, [userPlatformData]);

  const { renderSimpleRow, renderOrdinalSuffixV3, renderSimpleRowSkeleton } =
    useTableContentFormatter();

  const cellTemplatesObject = {
    name: renderSimpleRow,
    cuisine: renderOrdinalSuffixV3,
    discount_type: renderOrdinalSuffixV3,
    cuisine_and_discount_type: renderOrdinalSuffixV3,
  };

  const renderRowsByHeader = (r) =>
    headersAlert(cuisine).reduce(
      (acc, cur) => ({
        ...acc,
        [cur.id]: cellTemplatesObject?.[cur.id] ? cellTemplatesObject[cur.id](r, cur) : r[cur.id],
        id: `${cur.id}_${r.id}`,
        data: r,
      }),
      {}
    );

  const cellTemplatesObjectLoading = {
    name: renderSimpleRowSkeleton,
    cuisine: renderSimpleRowSkeleton,
    discount_type: renderSimpleRowSkeleton,
    cuisine_and_discount_type: renderSimpleRowSkeleton,
  };

  const renderRowsByHeaderLoading = (r) =>
    headersAlert(cuisine).reduce(
      (acc, cur) => ({
        ...acc,
        [cur.id]: cellTemplatesObjectLoading[cur.id](cur),
        id: r,
      }),
      {}
    );
  useEffect(() => {
    setTimeSlot(area === 'Everywhere' ? 'Throughout Day' : Object.keys(timeSlotObj)[0]);
  }, [area]);

  const getData = (plat, vend, stack) => {
    clearTimeout(fnDelays);
    if (loading) {
      setQueue((prev) => prev + 1);
      return;
    }

    fnDelays = setTimeout(async () => {
      setLoading(true);
      try {
        const body = {
          master_email: user.email,
          access_token: user.accessToken,
          vendors: vend || [],
          day_period: timeSlotObj[timeSlot] || 'All',
          filter_location: area,
          filter_offer: 'all_discounts',
          filter_cuisine: cuisine || '',
          start_date: dayjs(beforePeriodBtn.startDate).format('YYYY-MM-DD'),
          end_date: dayjs(beforePeriodBtn.endDate).format('YYYY-MM-DD'),
        };

        const ranking = await getRanking(body, plat);

        if (!ranking) {
          throw new Error('');
        }

        setCompetitionListingData(ranking.data.data);
        setLoading(false);
        if (stack === queue) setQueue(0);
      } catch (err) {
        setCompetitionListingData([]);
        setLoading(false);
        setQueue(0);
        triggerAlertWithMessageError('Error while retrieving data');
      }
    }, 750);
  };

  const getAreasData = async (plat, vend, stack) => {
    clearTimeout(fnDelaysAreas);
    if (loadingAreas) {
      setQueueAreas((prev) => prev + 1);
      return;
    }

    fnDelaysAreas = setTimeout(async () => {
      setLoadingAreas(true);
      try {
        const body = {
          master_email: user.email,
          access_token: user.accessToken,
          vendors: vend || [],
          start_date: dayjs(beforePeriodBtn.startDate).format('YYYY-MM-DD'),
          end_date: dayjs(beforePeriodBtn.endDate).format('YYYY-MM-DD'),
        };

        const areas = await getAreas(body, plat);

        if (!areas) {
          throw new Error('');
        }
        setAreasData(areas.data.locations);
        setLoadingAreas(false);
        if (stack === queueAreas) setQueueAreas(0);
      } catch (err) {
        setAreasData([]);
        setQueueAreas(0);
        setLoadingAreas(false);
        triggerAlertWithMessageError('Error while retrieving data');
      }
    }, 750);
  };

  const getCuisineData = async (plat, vend, stack) => {
    clearTimeout(fnDelaysCuisine);
    if (loadingCuisines) {
      setQueueCuisines((prev) => prev + 1);
      return;
    }

    fnDelaysCuisine = setTimeout(async () => {
      setLoadingCuisines(true);
      try {
        const body = {
          master_email: user.email,
          access_token: user.accessToken,
          vendors: vend || [],
          start_date: dayjs(beforePeriodBtn.startDate).format('YYYY-MM-DD'),
          end_date: dayjs(beforePeriodBtn.endDate).format('YYYY-MM-DD'),
        };

        const cuisines = await getCuisines(body, plat);

        if (!cuisines) {
          throw new Error('');
        }

        // TODO: ajust this function when the API return some data
        setCuisinesData(cuisines?.data?.cuisines || []);
        setLoadingCuisines(false);
        if (stack === queueCuisines) setQueueCuisines(0);
      } catch (err) {
        setCuisinesData([]);
        setQueueCuisines(0);
        setLoadingCuisines(false);
        triggerAlertWithMessageError('Error while retrieving data');
      }
    }, 750);
  };
  useEffect(() => {
    if (platform && vendorsData.vendorsObj[platform] !== null) {
      getAreasData(platform, vendorsData.vendorsObj[platform], queueAreas);
      getCuisineData(platform, vendorsData.vendorsObj[platform], queueAreas);
    }
  }, [platform, vendorsData, beforePeriodBtn, queueAreas]);

  useEffect(() => {
    const displayTemp = JSON.parse(JSON.stringify(vendors.display));
    let counter = 0;
    let defaultSelection = null;

    sortedVendors(displayTemp).forEach((chainName) => {
      Object.keys(displayTemp[chainName]).forEach((vendorName) => {
        displayTemp[chainName][vendorName].checked =
          vendorsData?.display?.[chainName]?.[vendorName]?.checked || false;

        const platformsDisplay = Object.keys(displayTemp[chainName][vendorName].platforms);
        platformsDisplay.forEach((platformV) => {
          if (platform !== platformV && !displayTemp[chainName][vendorName].is_matched) {
            displayTemp[chainName][vendorName].deleted = true;
            displayTemp[chainName][vendorName].checked = false;
          }

          if (!displayTemp[chainName][vendorName].platforms[platformV].metadata.is_active) {
            displayTemp[chainName][vendorName].deleted = true;
            displayTemp[chainName][vendorName].checked = false;
          }
          if (platform !== platformV) {
            displayTemp[chainName][vendorName].platforms[platformV].metadata.is_active = false;
          }
        });
        if (!platformsDisplay.includes(platform)) {
          displayTemp[chainName][vendorName].deleted = true;
          displayTemp[chainName][vendorName].checked = false;
        }

        if (!displayTemp[chainName][vendorName].deleted && !defaultSelection) {
          defaultSelection = {
            chainName,
            vendorName,
          };
        }

        if (displayTemp[chainName][vendorName].checked) {
          counter += 1;
        }
      });
    });

    if (counter === 0 && defaultSelection?.chainName && defaultSelection?.vendorName) {
      displayTemp[defaultSelection?.chainName][defaultSelection?.vendorName].checked = true;
    }

    setVendorsData({
      ...vendors,
      display: displayTemp,
      vendorsObj: { [platform]: selectedVendors('full', displayTemp, platform) },
    });
  }, [platform, vendors]);
  useEffect(() => {
    if (platform && area.length > 0 && timeSlot && vendorsData.vendorsObj[platform] !== null && queue === 0) {
      getData(platform, vendorsData.vendorsObj[platform], queue);
    }
  }, [platform, vendorsData, beforePeriodBtn, timeSlot, area, queue, cuisine]);

  return (
    <div className='wrapper'>
      <div className='top-inputs'>
        <RestaurantDropdown />
        <Dates
          isListing
          beforePeriodBtn={beforePeriodBtn}
          setbeforePeriodBtn={setbeforePeriodBtn}
          defaultTitle='Yesterday'
          defaultTypeDate='day'
        />
      </div>
      <TypographyKit sx={{ marginTop: '40px' }} variant='h4'>
        Competition - Listing
      </TypographyKit>
      <TypographyKit variant='subtitle'>
        Be informed on how you rank compared to your competitors
      </TypographyKit>
      <PaperKit className='competition-paper'>
        <div className='competition-top-input'>
          <div className='dropdowns'>
            {Array.isArray(platformList) && platformList.length > 0 ? (
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
                title='Select a Platform'
                type='platform'
                className='top-competition'
                setRow={setPlatform}
                select={platform}
              />
            ) : (
              ''
            )}

            <div className='listing-vendors top-competition'>
              <RestaurantDropdown
                pageType='listing'
                state={vendorsData}
                setState={setVendorsData}
              />
            </div>
            <CompetitionDropdown
              rows={area === 'Everywhere' ? ['Throughout Day'] : Object.keys(timeSlotObj)}
              renderOptions={(v) => (
                <MenuItemKit key={v} value={v}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      textTransform: 'capitalize',
                    }}
                  >
                    <ListItemTextKit primary={v} />
                  </div>
                </MenuItemKit>
              )}
              icon={TimeSlotIcon}
              title='Select Timeslot'
              type='timeslot'
              className='top-competition not-platform'
              setRow={setTimeSlot}
              select={timeSlot}
            />
            <CompetitionDropdown
              rows={cuisinesData}
              renderOptions={(v) => (
                <MenuItemKit key={v} value={v}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      textTransform: 'capitalize',
                    }}
                  >
                    <ListItemTextKit primary={v} />
                  </div>
                </MenuItemKit>
              )}
              icon={Iccuisine}
              title='Cuisine'
              type='cuisine'
              className='top-competition not-platform'
              setRow={setCuisine}
              select={cuisine || '—'}
            />

            <CompetitionDropdown
              rows={areasData.length > 0 ? areasData : ['Everywhere']}
              renderOptions={(v) => (
                <MenuItemKit key={v} value={v}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      textTransform: 'capitalize',
                    }}
                  >
                    <ListItemTextKit primary={v} />
                  </div>
                </MenuItemKit>
              )}
              icon={AreaIcon}
              title='Select Area'
              type='area'
              className='top-competition not-platform'
              setRow={setArea}
              select={area}
            />
          </div>
          <Competitor platformList={platformList} open={Open} opened={opened} />
        </div>
        <TypographyKit variant='subtitle'>
          You can select up to 5 competitors to be monitored. Competitors can be changed every 3
          months.
        </TypographyKit>
        <TableRevlyNew
          renderCustomSkelton={[0, 1, 2, 3, 4].map(renderRowsByHeaderLoading)}
          isLoading={loading}
          headers={headersAlert(cuisine)}
          rows={competitionListingData.map(renderRowsByHeader)}
          noEmptyMessage
          className='competition-alerts'
        />
        {loading
          ? null
          : getNumArr().map((num) => (
            <ButtonKit
              onClick={() => Open()}
              key={num}
              variant='contained'
              className='competition-add competiton-table-btn'
            >
              <AddIcon />
              Add a Competitor
            </ButtonKit>
          ))}
      </PaperKit>
    </div>
  );
};

export default CompetitionListing;
