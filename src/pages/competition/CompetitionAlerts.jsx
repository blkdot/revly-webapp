import React, { useState, useEffect } from 'react';
import Dates from '../../components/dates/Dates';
import RestaurantDropdown from '../../components/restaurantDropdown/RestaurantDropdown';
import PaperKit from '../../kits/paper/PaperKit';
import TypographyKit from '../../kits/typography/TypographyKit';
import './Competition.scss';
import useVendors from '../../hooks/useVendors';
import CompetitionTable from '../../components/competitonTable/CompetitionTable';
import Competitor from '../../components/competitor/Competitor';
import PlatformIcon from '../../assets/images/ic_select_platform.png';
import competitorIcon from '../../assets/images/ic_competitor.png';
import useDate from '../../hooks/useDate';
import useApi from '../../hooks/useApi';
import { useUserAuth } from '../../contexts/AuthContext';
import { useAlert } from '../../hooks/useAlert';
import ictalabat from '../../assets/images/talabat-favicon.png';
import icdeliveroo from '../../assets/images/deliveroo-favicon.webp';
import MenuItemKit from '../../kits/menuItem/MenuItemKit';
import ListItemTextKit from '../../kits/listItemtext/ListItemTextKit';
import CompetitionDropdown from '../../components/competitionDropdown/CompetitionDropdown';
import CheckboxKit from '../../kits/checkbox/CheckboxKit';
import { useGlobal } from '../../hooks/useGlobal';
import { usePlatform } from '../../hooks/usePlatform';

const CompetitionAlerts = () => {
  const { vendors, vendorsPlatform } = useVendors();
  const { vendorsContext, setRestaurants } = useGlobal();
  const [platformList, setPlatformList] = useState([]);
  const { user } = useUserAuth();
  const [opened, setOpened] = useState(false);
  const [platform, setPlatform] = useState('deliveroo');
  const [competitionAlertsData, setCompetitionAlertsData] = useState([]);
  const [competitor, setCompetitor] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [competitorList, setCompetitorList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getAlerts, getCompetitors } = useApi();
  const { triggerAlertWithMessageError } = useAlert();
  const { date } = useDate();
  const [beforePeriodBtn, setbeforePeriodBtn] = useState({
    startDate: date.beforePeriod.startDate,
    endDate: date.beforePeriod.endDate,
  });
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

  const getData = async (plat, vend) => {
    setLoading(true);
    try {
      const body = {
        master_email: user.email,
        access_token: user.accessToken,
        vendors: vend || {},
      };

      const alerts = await getAlerts(body, plat);

      const comp = await getCompetitors(body, plat);

      const filt = alerts.data?.data.map((v) => ({
        name: v.vendor_name,
        type: v.discount_type,
        alert: v.discount,
        mov: v.mov,
        start_date: v.start_date,
        status: v.status === 'Live' ? 'active' : 'inactive',
      }));

      setCompetitionAlertsData(filt || []);

      setCompetitorList(comp.data ? comp.data.data : []);

      setLoading(false);
    } catch (err) {
      setCompetitionAlertsData([]);
      setCompetitorList([]);
      setLoading(false);
      triggerAlertWithMessageError('Error while retrieving data');
    }
  };

  useEffect(() => {
    if (platform && vendors.length) {
      const arr = Object.keys(vendorsContext).filter((v) => v === platform);

      const red = arr.reduce((a, b) => ({ ...a, [b]: vendorsContext[arr] }), {});

      getData(platform, red);
    }
  }, [platform, vendorsContext]);

  useEffect(() => {
    const arr = vendors.filter((v) => v.platform === platform).map((k) => k.data.vendor_name);
    setRestaurants(arr);
  }, [platform]);

  const handleCompetitorChange = (e) => {
    const { value } = e.target;
    if (value.length > 0) {
      const arr = value
        .map((v) => competitionAlertsData.filter((k) => k.name === v.vendor_name))
        .flat();
      setFilteredData(arr);
    } else {
      setFilteredData([]);
    }
    setCompetitor(value);
  };

  return (
    <div className="wrapper">
      <div className="top-inputs">
        <RestaurantDropdown
          vendors={vendors.filter((v) => v.platform === platform)}
          vendorsPlatform={vendorsPlatform}
        />
        <Dates beforePeriodBtn={beforePeriodBtn} setbeforePeriodBtn={setbeforePeriodBtn} />
      </div>
      <TypographyKit sx={{ marginTop: '40px' }} variant="h4">
        Competition - Alerts
      </TypographyKit>
      <TypographyKit variant="subtitle">
        Keep an eye on your competitors marketing campaigns
      </TypographyKit>
      <PaperKit className="competition-paper">
        <div className="competition-top-input alerts-top-inputs">
          <div className="competition-dropdowns">
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
            <CompetitionDropdown
              rows={competitorList}
              multiple
              icon={competitorIcon}
              onChange={handleCompetitorChange}
              renderValue={(v) => v.map((k) => k.vendor_name).join(',')}
              renderOptions={(v) => (
                <MenuItemKit key={v.vendor_name} value={v}>
                  <CheckboxKit checked={competitor.indexOf(v) > -1} />
                  <ListItemTextKit primary={v.vendor_name} />
                </MenuItemKit>
              )}
              title="Competitor"
              className="top-competition"
              select={competitor}
            />
          </div>
          <Competitor open={Open} opened={opened} />
        </div>
        <TypographyKit variant="subtitle">
          You can select up to 5 competitors to be monitored. Competitors can be changed every 3
          months.
        </TypographyKit>
        <CompetitionTable
          loading={loading}
          type="alerts"
          open={Open}
          rows={filteredData.length > 0 ? filteredData : competitionAlertsData}
        />
      </PaperKit>
    </div>
  );
};

export default CompetitionAlerts;
