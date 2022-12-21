import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import AddIcon from '@mui/icons-material/Add';
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
import { useGlobal } from '../../hooks/useGlobal';
import { usePlatform } from '../../hooks/usePlatform';
import useTableContentFormatter from '../../components/tableRevly/tableContentFormatter/useTableContentFormatter';
import TableRevly from '../../components/tableRevly/TableRevly';
import ButtonKit from '../../kits/button/ButtonKit';
import RestaurantDropdownOld from '../../components/restaurantDropdown/RestaurantDropdownOld';
import TimeSlotIcon from '../../assets/images/ic_timeslot.png';
import AreaIcon from '../../assets/images/ic_area.png';

const CompetitionListing = () => {
  let fnDelays = null;
  const { setVendors } = useGlobal();
  const { vendors } = useDate();
  const { vendorsArr, vendorsSelected, vendorsObj, display, chainObj } = vendors;
  const [opened, setOpened] = useState(false);
  const [platformList, setPlatformList] = useState([]);
  const [platform, setPlatform] = useState('deliveroo');
  const [area, setArea] = useState('Everywhere');
  const [timeSlot, setTimeSlot] = useState('Throughout day');
  const [loading, setLoading] = useState(true);
  const [competitionListingData, setCompetitionListingData] = useState([]);
  const { triggerAlertWithMessageError } = useAlert();
  const { date } = useDate();
  const [beforePeriodBtn, setbeforePeriodBtn] = useState({
    startDate: date.beforePeriod.startDate,
    endDate: date.beforePeriod.endDate,
  });
  const { getRanking } = useApi();
  const { user } = useUserAuth();
  const { userPlatformData } = usePlatform();

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
      label: 'Listing in cuisine',
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

  const getData = (plat, vend) => {
    clearTimeout(fnDelays);

    fnDelays = setTimeout(async () => {
      setLoading(true);
      try {
        const body = {
          master_email: user.email,
          access_token: user.accessToken,
          vendors: vend || [],
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
        setLoading(false);
      } catch (err) {
        setCompetitionListingData([]);
        setLoading(false);
        triggerAlertWithMessageError('Error while retrieving data');
      }
    }, 750);
  };

  useEffect(() => {
    if (Object.keys(display).length > 0) {
      if (platform) {
        getData(platform, vendorsObj[platform]);
      }
    } else if (platform && vendorsArr.length > 0) {
      getData(platform, vendorsObj[platform]);
    }
  }, [platform, vendors, beforePeriodBtn]);

  useEffect(() => {
    if (Object.keys(display).length > 0) {
      const chainObjTemp = JSON.parse(JSON.stringify(display));
      const vendorsObjTemp = { [platform]: [] };
      Object.keys(display).forEach((c) => {
        Object.keys(display[c]).forEach((v) => {
          Object.keys(display[c][v]).forEach((p) => {
            if (p === platform) {
              vendorsObjTemp[p] = [...vendorsObjTemp[p], chainObjTemp[c][v][p]];
            } else {
              delete chainObjTemp[c][v][p];
            }
          });
        });
      });
      setVendors({ ...vendors, chainObj: chainObjTemp, vendorsObj: vendorsObjTemp });
    } else {
      const arr = vendorsArr.filter((v) => v.platform === platform);
      const obj = { [platform]: arr.map((k) => k) };
      setVendors({
        ...vendors,
        vendorsSelected: arr.map((k) => k.data.vendor_name),
        vendorsObj: obj,
      });
    }
  }, [platform, display]);
  return (
    <div className="wrapper">
      <div className="top-inputs">
        {Object.keys(display).length > 0 ? (
          <RestaurantDropdown chainObj={chainObj} />
        ) : (
          <RestaurantDropdownOld
            vendorsSelected={vendorsSelected}
            vendors={vendorsArr.filter((v) => v.platform === platform)}
            vendorsPlatform={Object.keys(vendorsObj)}
          />
        )}
        <Dates beforePeriodBtn={beforePeriodBtn} setbeforePeriodBtn={setbeforePeriodBtn} />
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
            <CompetitionDropdown
              rows={[
                'Throughout day',
                'Breakfast (04:00 - 11:00)',
                'Lunch (11:00 - 14:00)',
                'Interpeak (14:00 - 17:00)',
                'Dinner (17:00 - 00:00)',
                'Late night (00:00 - 04:00)',
              ]}
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
              title="Select a TimeSlot"
              type="timeslot"
              className="top-competition not-platform"
              setRow={setTimeSlot}
              select={timeSlot}
            />
            <CompetitionDropdown
              rows={['Everywhere', 'JLT', 'JVC', 'Marina', 'Business Marina']}
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
              title="Select a Area"
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
