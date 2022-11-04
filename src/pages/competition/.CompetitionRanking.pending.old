import React, { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import Dates from '../../components/dates/Dates';
import RestaurantDropdown from '../../components/restaurantDropdown/RestaurantDropdown';
import PaperKit from '../../kits/paper/PaperKit';
import TypographyKit from '../../kits/typography/TypographyKit';
import './Competition.scss';
import CompetitionDropdown from '../../components/competitionDropdown/CompetitionDropdown';
// import CompetitionTable from '../../components/competitonTable/CompetitionTable';
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
import useVendors from '../../hooks/useVendors';
import useTableContentFormatter from '../../components/tableRevly/tableContentFormatter/useTableContentFormatter';
import TableRevly from '../../components/tableRevly/TableRevly';
import ButtonKit from '../../kits/button/ButtonKit';

const CompetitionRanking = () => {
  const { setVendors } = useGlobal();
  const { vendors } = useVendors();
  const { vendorsArr, vendorsPlatform, vendorsObj, restaurants } = vendors;
  const [opened, setOpened] = useState(false);
  const [platformList, setPlatformList] = useState([]);
  const [platform, setPlatform] = useState('deliveroo');
  const [loading, setLoading] = useState(true);
  const [competitionRankingData, setCompetitionRankingData] = useState([]);
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
    for (let i = 0; i < 5 - competitionRankingData.length; i++) {
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
      label: 'Ranking in offers',
    },
    {
      id: 'r_cuis',
      numeric: false,
      disablePadding: true,
      label: 'Ranking in cuisine',
    },
    {
      id: 'r_all',
      numeric: false,
      disablePadding: true,
      label: 'Ranking in offers and cuisine',
    },
    {
      id: 'ov',
      numeric: false,
      disablePadding: true,
      label: 'Overall Ranking',
    },
  ];

  const { renderPlatform, renderSimpleRow, renderOrdinalSuffix } = useTableContentFormatter();

  const cellTemplatesObject = {
    name: renderSimpleRow,
    platform: renderPlatform,
    r_offers: renderOrdinalSuffix,
    r_cuis: renderOrdinalSuffix,
    r_all: renderOrdinalSuffix,
    ov: renderOrdinalSuffix,
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

  const getData = async (plat, vend) => {
    setLoading(true);
    try {
      const body = {
        master_email: user.email,
        access_token: user.accessToken,
        vendors: vend || [],
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

      setCompetitionRankingData(filt);
      setLoading(false);
    } catch (err) {
      setCompetitionRankingData([]);
      setLoading(false);
      triggerAlertWithMessageError('Error while retrieving data');
    }
  };

  useEffect(() => {
    if (platform && vendorsArr.length) {
      getData(platform, vendorsObj[platform]);
    }
  }, [platform, vendorsObj, beforePeriodBtn]);

  useEffect(() => {
    const arr = vendorsArr.filter((v) => v.platform === platform).map((k) => k.data.vendor_name);
    setVendors({ ...vendors, restaurants: arr });
    localStorage.setItem('vendors', JSON.stringify({ ...vendors, restaurants: arr }));
  }, [platform]);

  return (
    <div className="wrapper">
      <div className="top-inputs">
        <RestaurantDropdown
          vendors={vendorsArr.filter((v) => v.platform === platform)}
          vendorsPlatform={vendorsPlatform}
          restaurants={restaurants}
        />
        <Dates beforePeriodBtn={beforePeriodBtn} setbeforePeriodBtn={setbeforePeriodBtn} />
      </div>
      <TypographyKit sx={{ marginTop: '40px' }} variant="h4">
        Competition - Ranking
      </TypographyKit>
      <TypographyKit variant="subtitle">
        Be informed on how you rank compared to your competitors
      </TypographyKit>
      <PaperKit className="competition-paper">
        <div className="competition-top-input">
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
            id="platform_dropdown_menu"
            type="platform"
            className="top-competition"
            setRow={setPlatform}
            select={platform}
          />
          <Competitor platformList={platformList} open={Open} opened={opened} />
        </div>
        <TypographyKit variant="subtitle">
          You can select up to 5 competitors to be monitored. Competitors can be changed every 3
          months.
        </TypographyKit>
        {/* <CompetitionTable
          loading={loading}
          type="ranking"
          open={Open}
          rows={competitionRankingData}
        /> */}
        <TableRevly
          isLoading={loading}
          headers={headersAlert}
          rows={competitionRankingData.map(renderRowsByHeader)}
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

export default CompetitionRanking;
