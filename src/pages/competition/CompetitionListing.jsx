import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import AddIcon from '@mui/icons-material/Add';
import { subDays } from 'date-fns';
import Dates from '../../components/dates/Dates';
import RestaurantDropdown from '../../components/restaurantDropdown/RestaurantDropdown.suspended';
import PaperKit from '../../kits/paper/PaperKit';
import TypographyKit from '../../kits/typography/TypographyKit';
import './Competition.scss';
import CompetitionDropdown from '../../components/competitionDropdown/CompetitionDropdown';
import Competitor from '../../components/competitor/Competitor';
import PlatformIcon from '../../assets/images/ic_select_platform.png';
import useDate from '../../hooks/useDate';
import ListItemTextKit from '../../kits/listItemtext/ListItemTextKit';
import MenuItemKit from '../../kits/menuItem/MenuItemKit';
import ictalabat from '../../assets/images/talabat-favicon.png';
import icdeliveroo from '../../assets/images/deliveroo-favicon.webp';
import useApi from '../../hooks/useApi';
import { useUserAuth } from '../../contexts/AuthContext';
import { useAlert } from '../../hooks/useAlert';
import { usePlatform } from '../../hooks/usePlatform';
import useTableContentFormatter from '../../components/tableRevly/tableContentFormatter/useTableContentFormatter';
import TableRevly from '../../components/tableRevly/TableRevly';
import ButtonKit from '../../kits/button/ButtonKit';
import RestaurantDropdownOld from '../../components/restaurantDropdown/RestaurantDropdownOld';
import TimeSlotIcon from '../../assets/images/ic_timeslot.png';
import AreaIcon from '../../assets/images/ic_area.png';
import selectIcon from '../../assets/images/ic_select.png';
import MarketingCheckmarksDropdown from '../../components/marketingSetup/MarketingChecmarksDropdown';

let fnDelays = null;
let fnDelaysAreas = null;
const CompetitionListing = () => {
  const { vendors } = useDate();
  const { vendorsArr, vendorsSelected, display, chainObj } = vendors;
  const [opened, setOpened] = useState(false);
  const [platformList, setPlatformList] = useState([]);
  const [platform, setPlatform] = useState('deliveroo');
  const [area, setArea] = useState('Everywhere');
  const [timeSlot, setTimeSlot] = useState('Throughout Day');
  const [loading, setLoading] = useState(false);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [competitionListingData, setCompetitionListingData] = useState([]);
  const [cuisine, setCuisine] = useState('');
  const { triggerAlertWithMessageError } = useAlert();
  const [beforePeriodBtn, setbeforePeriodBtn] = useState({
    startDate: subDays(new Date(), 1),
    endDate: subDays(new Date(), 1),
  });
  const [queue, setQueue] = useState(0);
  const [queueAreas, setQueueAreas] = useState(0);
  const { getRanking, getAreas } = useApi();
  const { user } = useUserAuth();
  const { userPlatformData } = usePlatform();
  const [areasData, setAreasData] = useState([]);
  const [vendorsData, setVendorsData] = useState(JSON.parse(JSON.stringify(vendors)));

  useEffect(() => {
    const displayTemp = JSON.parse(JSON.stringify(display));
    if (Object.keys(displayTemp).length > 0) {
      const chainRandom =
        Object.keys(displayTemp)[
          Math.floor(Math.random() * Object.keys(displayTemp).length - 1) + 1
        ];
      const vendorRandom = Object.keys(displayTemp[chainRandom])[
        Math.floor(Math.random() * Object.keys(displayTemp[chainRandom]).length - 1) + 1
      ];
      setVendorsData({
        ...vendors,
        chainObj: {
          [chainRandom]: { [vendorRandom]: { ...displayTemp[chainRandom][vendorRandom] } },
        },
        vendorsObj: { [platform]: [displayTemp?.[chainRandom]?.[vendorRandom]?.[platform]] },
      });
    } else {
      const vendorsSelectedTemp = [
        vendorsArr.filter((v) => v.platform === platform)[
          Math.floor(
            Math.random() * vendorsArr.filter((obj) => obj.platform === platform).length - 1,
          ) + 1
        ]?.data?.vendor_name,
      ];
      setVendorsData({
        ...vendors,
        vendorsSelected: vendorsSelectedTemp,
        vendorsObj: {
          [platform]: [vendorsArr.find((obj) => obj.data.vendor_name === vendorsSelectedTemp[0])],
        },
      });
    }
  }, [vendors, platform]);
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
          registered: pl[v].active,
        }))
        .filter((k) => k.registered === true);

      setPlatform(list[0]?.name);
      setPlatformList(list);
    }
  }, [userPlatformData]);

  const headersAlert = [
    {
      id: 'name',
      numeric: false,
      disablePadding: true,
      label: 'Name',
    },
    {
      id: 'platform',
      numeric: false,
      disablePadding: true,
      label: 'Platform',
    },
    {
      id: 'r_offers',
      numeric: false,
      disablePadding: true,
      label: 'Listing in offers',
    },
    {
      id: 'r_cuis',
      numeric: false,
      disablePadding: true,
      label: `Listing in ${cuisine} cuisine`,
    },
    {
      id: 'r_all',
      numeric: false,
      disablePadding: true,
      label: 'Listing in offers and cuisine',
    },
  ];

  const { renderPlatform, renderSimpleRow, renderOrdinalSuffix } = useTableContentFormatter();

  const cellTemplatesObject = {
    name: renderSimpleRow,
    platform: renderPlatform,
    r_offers: renderOrdinalSuffix,
    r_cuis: renderOrdinalSuffix,
    r_all: renderOrdinalSuffix,
  };

  const renderRowsByHeader = (r) =>
    headersAlert.reduce(
      (acc, cur) => ({
        ...acc,
        [cur.id]: cellTemplatesObject[cur.id] ? cellTemplatesObject[cur.id](r, cur) : r[cur.id],
        id: `${cur.id}_${r.id}`,
        data: r,
      }),
      {},
    );
  const timeSlotObj = {
    'Throughout Day': 'Throughout Day',
    'Breakfast (04:00 - 11:00)': 'Breakfast',
    'Lunch (11:00 - 14:00)': 'Lunch',
    'Interpeak (14:00 - 17:00)': 'Interpeak',
    'Dinner (17:00 - 00:00)': 'Dinner',
    'Late night (00:00 - 04:00)': 'Late Night',
  };
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
          timeslot: timeSlotObj[timeSlot] || timeSlot,
          location: area === 'Everywhere' ? 'ALL' : area,
          start_date: dayjs(beforePeriodBtn.startDate).format('YYYY-MM-DD'),
          end_date: dayjs(beforePeriodBtn.endDate).format('YYYY-MM-DD'),
        };

        const ranking = await getRanking(body, plat);

        if (!ranking) {
          throw new Error('');
        }

        const filt = ranking.data.data.map((v) => ({
          name: v.name,
          r_offers: v.basket_discount_only,
          r_cuis: v.italian_only,
          r_all: v.italian_basket_discount,
          ov: v.no_filter,
          platform,
          id: v.id,
        }));

        setCompetitionListingData(filt);
        setCuisine(ranking.data.cuisine);
        setLoading(false);
        if (stack === queue) setQueue(0);
      } catch (err) {
        setCompetitionListingData([]);
        setCuisine('');
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
  useEffect(() => {
    if (Object.keys(display).length > 0) {
      if (platform && area && timeSlot && vendorsData.vendorsObj[platform] !== null) {
        getData(platform, vendorsData.vendorsObj[platform], queue);
      }
    } else if (
      platform &&
      vendorsData?.vendorsArr?.length > 0 &&
      area &&
      timeSlot &&
      vendorsData.vendorsObj[platform] !== null
    ) {
      getData(platform, vendorsData.vendorsObj[platform], queue);
    }
  }, [platform, vendorsData, beforePeriodBtn, timeSlot, area, queue]);

  useEffect(() => {
    if (Object.keys(display).length > 0) {
      if (platform && vendorsData.vendorsObj[platform] !== null) {
        getAreasData(platform, vendorsData.vendorsObj[platform], queueAreas);
      }
    } else if (
      platform &&
      vendorsData.vendorsArr.length > 0 &&
      vendorsData.vendorsObj[platform] !== null
    ) {
      getAreasData(platform, vendorsData.vendorsObj[platform], queueAreas);
    }
  }, [platform, vendorsData, beforePeriodBtn, queueAreas]);

  return (
    <div className="wrapper">
      <div className="top-inputs">
        {Object.keys(display).length > 0 ? (
          <RestaurantDropdown chainObj={chainObj} />
        ) : (
          <RestaurantDropdownOld
            vendorsSelected={vendorsSelected}
            vendors={vendorsArr.filter((v) => v.platform === platform)}
          />
        )}
        <Dates
          isListing
          beforePeriodBtn={beforePeriodBtn}
          setbeforePeriodBtn={setbeforePeriodBtn}
          defaultTitle="Yesterday"
          defaultTypeDate="day"
        />
      </div>
      <TypographyKit sx={{ marginTop: '40px' }} variant="h4">
        Competition - Listing
      </TypographyKit>
      <TypographyKit variant="subtitle">
        Be informed on how you rank compared to your competitors
      </TypographyKit>
      <PaperKit className="competition-paper">
        <div className="competition-top-input">
          <div className="dropdowns">
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
                        alt="icon"
                      />
                      <ListItemTextKit primary={v.name} />
                    </div>
                  </MenuItemKit>
                )}
                icon={PlatformIcon}
                title="Select a Platform"
                type="platform"
                className="top-competition"
                setRow={setPlatform}
                select={platform}
              />
            ) : (
              ''
            )}

            <div className="listing-vendors">
              <MarketingCheckmarksDropdown
                names={vendorsArr
                  .filter((obj) => obj.platform === platform)
                  .map((obj) => obj.data.vendor_name)}
                icon={selectIcon}
                title="Select Vendors"
                setName={setVendorsData}
                personName={vendorsData}
                width={400}
                height={100}
                type="vendor"
                platform={platform}
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
              title="Select Timeslot"
              type="timeslot"
              className="top-competition not-platform"
              setRow={setTimeSlot}
              select={timeSlot}
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
              title="Select Area"
              type="area"
              className="top-competition not-platform"
              setRow={setArea}
              select={area}
            />
          </div>
          <Competitor platformList={platformList} open={Open} opened={opened} />
        </div>
        <TypographyKit variant="subtitle">
          You can select up to 5 competitors to be monitored. Competitors can be changed every 3
          months.
        </TypographyKit>
        <TableRevly
          isLoading={loading}
          headers={headersAlert}
          rows={competitionListingData.map(renderRowsByHeader)}
        />
        {loading
          ? null
          : getNumArr().map((num) => (
              <ButtonKit
                onClick={() => Open()}
                key={num}
                variant="contained"
                className="competition-add competiton-table-btn"
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
