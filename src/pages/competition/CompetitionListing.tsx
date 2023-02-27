import RestaurantDropdown from 'components/restaurantDropdown/RestaurantDropdown';
import selectedVendors from 'components/restaurantDropdown/selectedVendors';
import sortedVendors from 'components/restaurantDropdown/soretedVendors';
import TableRevlyNew from 'components/tableRevly/TableRevlyNew';
import { useUser } from 'contexts';
import { subDays } from 'date-fns';
import dayjs from 'dayjs';
import { useAlert, useApi, usePlatform, useVendors } from 'hooks';
import { useAtom } from 'jotai';
import { ListItemTextKit, MenuItemKit, PaperKit, TypographyKit } from 'kits';
import { useCallback, useEffect, useState } from 'react';
import icdeliveroo from '../../assets/images/deliveroo-favicon.webp';
import AreaIcon from '../../assets/images/ic_area.png';
import Iccuisine from '../../assets/images/ic_cuisine.png';
import PlatformIcon from '../../assets/images/ic_select_platform.png';
import TimeSlotIcon from '../../assets/images/ic_timeslot.png';
import ictalabat from '../../assets/images/talabat-favicon.png';
import CompetitionDropdown from '../../components/competitionDropdown/CompetitionDropdown';
import Competitor from '../../components/competitor/Competitor';
import Dates from '../../components/dates/Dates';
import useTableContentFormatter from '../../components/tableRevly/tableContentFormatter/useTableContentFormatter';
import { vendorsAtom } from '../../store/vendorsAtom';
import './Competition.scss';

let fnDelays = null;
let fnDelaysDropdown = null;

const timeSlotObj = {
  'Breakfast (04:00 - 11:00)': 'Breakfast',
  'Lunch (11:00 - 14:00)': 'Lunch',
  'Interpeak (14:00 - 17:00)': 'Interpeak',
  'Dinner (17:00 - 00:00)': 'Dinner',
  'Late night (00:00 - 04:00)': 'Late Night',
  'Throughout Day': 'Throughout Day',
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
  const { vendors: vendorsDatas } = useVendors();
  const [opened, setOpened] = useState(false);
  const [platformList, setPlatformList] = useState([]);
  const [platform, setPlatform] = useState('deliveroo');
  const [area, setArea] = useState('Everywhere');
  const [timeSlot, setTimeSlot] = useState('Throughout Day');
  const [loading, setLoading] = useState(false);
  const [competitionListingData, setCompetitionListingData] = useState([]);
  const [cuisine, setCuisine] = useState('');
  const { triggerAlertWithMessageError } = useAlert();
  const [beforePeriodBtn, setbeforePeriodBtn] = useState({
    startDate: subDays(new Date(), 1),
    endDate: subDays(new Date(), 1),
  });
  const [queueDropdown, setQueueDropdown] = useState(0);
  const { getRanking, getAreas, getCuisines } = useApi();
  const user = useUser();
  const { userPlatformData } = usePlatform();
  const [areasData, setAreasData] = useState([]);
  const [cuisinesData, setCuisinesData] = useState([]);
  const [vendorsData, setVendorsData] = useState(JSON.parse(JSON.stringify(vendorsDatas)));

  const Open = () => {
    setOpened(!opened);
    const body = document.querySelector('body');
    if (opened) {
      body.style.overflowY = 'visible';
    } else {
      body.style.overflowY = 'hidden';
    }
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
    setTimeSlot((prev) => (area === 'Everywhere' ? 'Throughout Day' : prev));
  }, [area]);

  const getData = (plat, vend, newCuisine, newArea) => {
    clearTimeout(fnDelays);

    fnDelays = setTimeout(async () => {
      try {
        const body = {
          master_email: user.email,
          access_token: user.token,
          vendors: vend || [],
          day_period: timeSlotObj[timeSlot] || 'All',
          filter_location: newArea,
          filter_offer: 'all_discounts',
          filter_cuisine: newCuisine || '',
          start_date: dayjs(beforePeriodBtn.startDate).format('YYYY-MM-DD'),
          end_date: dayjs(beforePeriodBtn.endDate).format('YYYY-MM-DD'),
        };

        const ranking = await getRanking(body, plat);

        if (!ranking) {
          throw new Error('');
        }

        setCompetitionListingData(ranking.data.data);
        setLoading(false);
      } catch (err) {
        setCompetitionListingData([]);
        setLoading(false);
        triggerAlertWithMessageError('Error while retrieving data');
      }
    }, 250);
  };

  const handleCuisineDataResponse = (cuisines) => {
    if (!cuisines) {
      setCuisine('');
      setCuisinesData([]);
      return '';
    }

    setCuisinesData(cuisines?.data?.cuisines || []);
    setCuisine(cuisines?.data?.cuisines[0] || '');

    return cuisines?.data?.cuisines[0] || '';
  };

  const handleAreasDataResponse = (areas) => {
    setAreasData(areas.data.locations?.sort());
    setTimeSlot('Throughout Day');
    if (!areas) {
      setArea('Everywhere');
      return 'Everywhere';
    }

    setArea(areas.data.locations[0] || 'Everywhere');
    return areas.data.locations[0] || 'Everywhere';
  };

  const getCuisineAndAreas = useCallback(
    async (plat, vend, stack) => {
      clearTimeout(fnDelaysDropdown);

      if (vend && vend?.length === 0) {
        return;
      }

      if (loading) {
        setQueueDropdown((prev) => prev + 1);
        return;
      }

      fnDelaysDropdown = setTimeout(async () => {
        setLoading(true);

        const body = {
          master_email: user.email,
          access_token: user.token,
          vendors: vend || [],
          start_date: dayjs(beforePeriodBtn.startDate).format('YYYY-MM-DD'),
          end_date: dayjs(beforePeriodBtn.endDate).format('YYYY-MM-DD'),
        };

        Promise.all([getCuisines(body, plat), getAreas(body, plat)])
          .then(([cuisineResult, areaResult]) => {
            const newCuisine = handleCuisineDataResponse(cuisineResult);
            const newArea = handleAreasDataResponse(areaResult);

            if (stack === queueDropdown) setQueueDropdown(0);

            return { newCuisine, newArea };
          })
          .then(({ newCuisine, newArea }) => {
            getData(platform, vendorsData.vendorsObj[platform], newCuisine, newArea);
          })
          .catch((err) => {
            setLoading(false);
            triggerAlertWithMessageError(err.message);
            setAreasData([]);
            setCuisine('');
            setCuisinesData([]);
            setTimeSlot('Throughout Day');
            setArea('Everywhere');
          });
      }, 750);
    },
    [platform, vendorsData]
  );

  useEffect(() => {
    if (
      platform &&
      area &&
      timeSlot &&
      cuisine &&
      vendorsData.vendorsObj[platform] &&
      cuisinesData.length > 0
    ) {
      setLoading(true);
      getData(platform, vendorsData.vendorsObj[platform], cuisine, area);
    }
  }, [cuisine, area, timeSlot, beforePeriodBtn]);

  useEffect(() => {
    if (platform && vendorsData.vendorsObj[platform] !== null) {
      getCuisineAndAreas(platform, vendorsData.vendorsObj[platform], queueDropdown);
    }
  }, [platform, vendorsData, queueDropdown]);

  useEffect(() => {
    const displayTemp = JSON.parse(JSON.stringify(vendorsDatas.display));
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
      ...vendorsDatas,
      display: displayTemp,
      vendorsObj: { [platform]: selectedVendors('full', displayTemp, platform) },
    });
  }, [platform, vendorsDatas]);

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
              rows={cuisinesData.length > 0 ? cuisinesData : ['—']}
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
              disabled={cuisinesData.length < 1}
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
              tooltipMessage='Select Area First'
            />
          </div>
          <Competitor platformList={platformList} open={Open} opened={opened} />
        </div>
        <TableRevlyNew
          renderCustomSkelton={[0, 1, 2, 3, 4].map(renderRowsByHeaderLoading)}
          isLoading={loading}
          headers={headersAlert(cuisine)}
          rows={competitionListingData.map(renderRowsByHeader)}
          className='competition-alerts'
          mainFieldOrdered='name'
          mainOrder='desc'
        />
      </PaperKit>
    </div>
  );
};

export default CompetitionListing;
