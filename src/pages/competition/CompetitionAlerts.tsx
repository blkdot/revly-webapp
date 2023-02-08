import { useUserAuth } from 'contexts';
import dayjs from 'dayjs';
import { useAlert, useApi, usePlatform } from 'hooks';
import { useAtom } from 'jotai';
import { CheckboxKit, ListItemTextKit, MenuItemKit, PaperKit, TypographyKit } from 'kits';
import { useEffect, useState } from 'react';
import RestaurantDropdown from 'components/restaurantDropdown/RestaurantDropdown';
import icdeliveroo from '../../assets/images/deliveroo-favicon.webp';
import competitorIcon from '../../assets/images/ic_competitor.png';
import PlatformIcon from '../../assets/images/ic_select_platform.png';
import ictalabat from '../../assets/images/talabat-favicon.png';
import CompetitionDropdown from '../../components/competitionDropdown/CompetitionDropdown';
import Competitor from '../../components/competitor/Competitor';
import Dates from '../../components/dates/Dates';
import useTableContentFormatter from '../../components/tableRevly/tableContentFormatter/useTableContentFormatter';
import TableRevly from '../../components/tableRevly/TableRevly';
import { vendorsAtom } from '../../store/vendorsAtom';
import './Competition.scss';

let fnDelays = null;

const CompetitionAlerts = () => {
  const [vendors, setVendors] = useAtom(vendorsAtom);
  const { vendorsArr, vendorsSelected, vendorsObj, display, chainObj } = vendors;
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
  const [beforePeriodBtn, setbeforePeriodBtn] = useState({
    startDate: new Date(),
    endDate: new Date(),
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

  const headersAlert = [
    {
      id: 'name',
      numeric: false,
      disablePadding: true,
      label: 'Name',
    },
    {
      id: 'type',
      numeric: false,
      disablePadding: true,
      label: 'Type',
    },
    {
      id: 'alert',
      numeric: false,
      disablePadding: true,
      label: 'Alert',
    },
    {
      id: 'start_date',
      numeric: false,
      disablePadding: true,
      label: 'Start Date',
    },
    {
      id: 'end_date',
      numeric: false,
      disablePadding: true,
      label: 'End Date',
    },
    {
      id: 'start_hour',
      numeric: false,
      disablePadding: true,
      label: 'Start Hour',
    },
    {
      id: 'end_hour',
      numeric: false,
      disablePadding: true,
      label: 'End Hour',
    },
    {
      id: 'status',
      numeric: false,
      disablePadding: true,
      label: 'Status',
    },
  ];

  const { renderPercent, renderStatus, renderSimpleRow, renderIsoDateOnly, renderIsoStartTimeOnlyFromDate, renderIsoEndTimeOnlyFromDate } = useTableContentFormatter();

  const cellTemplatesObject = {
    name: renderSimpleRow,
    type: renderSimpleRow,
    alert: renderPercent,
    start_date: renderIsoDateOnly,
    end_date: renderIsoDateOnly,
    start_hour: renderIsoStartTimeOnlyFromDate,
    end_hour: renderIsoEndTimeOnlyFromDate,
    status: renderStatus,
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

  const getData = (plat, vend) => {
    clearTimeout(fnDelays);

    fnDelays = setTimeout(async () => {
      setLoading(true);
      try {
        const body = {
          master_email: user.email,
          access_token: user.accessToken,
          vendors: vend || {},
          start_date: dayjs(beforePeriodBtn.startDate).format('YYYY-MM-DD'),
          end_date: dayjs(beforePeriodBtn.endDate).format('YYYY-MM-DD'),
        };
        const alerts = await getAlerts(body, plat);

        const comp = await getCompetitors(body, plat);

        const filt = alerts.data?.data
          .map((v) => ({
            name: v.vendor_name,
            type: v.discount_type,
            alert: v.discount,
            start_date: v.start_date,
            end_date: v.end_date,
            start_hour: v.start_hour,
            end_hour: v.end_hour,
            status: v.status,
            id: v.alert_id,
          }))
          .sort((a, b) => a.status - b.status);
        setCompetitionAlertsData(filt || []);

        setCompetitorList(comp.data ? comp.data.data : []);
        setCompetitor(comp.data ? comp.data.data : []);
        setFilteredData(
          (comp.data ? comp.data.data : [])
            .map((v) => filt.filter((k) => k.name === v.vendor_name))
            .flat()
        );
        setLoading(false);
      } catch (err) {
        setCompetitionAlertsData([]);
        setCompetitorList([]);
        setCompetitor([]);
        setFilteredData([]);
        setLoading(false);
        triggerAlertWithMessageError('Error while retrieving data');
      }
    }, 750);
  };

  useEffect(() => {
    if (platform && vendorsArr.length) {
      const arr: any = Object.keys(vendorsObj).filter((v) => v === platform);

      const red = arr.reduce((a, b) => ({ ...a, [b]: vendorsObj[arr] }), {});

      getData(platform, red);
    }
  }, [platform, vendors, beforePeriodBtn]);

  useEffect(() => {
    const arr = vendorsArr.filter(
      (v) =>
        v.platform === platform &&
        (v.metadata.is_active === 'True' || v.metadata.is_active === true)
    );
    setVendors({ ...vendors, vendorsSelected: arr, vendorsObj: { [platform]: arr } });
  }, [platform]);

  const handleCompetitorChange = (e) => {
    const { value } = e.target;
    if (value.length > 1) {
      const arr = value
        .map((v) => competitionAlertsData.filter((k) => k.name === v.vendor_name))
        .flat();
      setFilteredData(arr);
    } else {
      setFilteredData([]);
    }
    setCompetitor(value);
  };

  const renderRowsByHeader = (r) =>
    headersAlert.reduce(
      (acc, cur) => ({
        ...acc,
        [cur.id]: cellTemplatesObject[cur.id] ? cellTemplatesObject[cur.id](r, cur) : r[cur.id],
        id: `${cur.id}_${r.id}`,
        data: r,
      }),
      {}
    );

  return (
    <div className='wrapper'>
      <div className='top-inputs'>
        <RestaurantDropdown />
        <Dates
          defaultTypeDate='day'
          defaultTitle='today'
          beforePeriodBtn={beforePeriodBtn}
          setbeforePeriodBtn={setbeforePeriodBtn}
        />
      </div>
      <TypographyKit sx={{ marginTop: '40px' }} variant='h4'>
        Competition - Alerts
      </TypographyKit>
      <TypographyKit variant='subtitle'>
        Keep an eye on your competitors marketing campaigns
      </TypographyKit>
      <PaperKit className='competition-paper'>
        <div className='competition-top-input alerts-top-inputs'>
          <div className='competition-dropdowns'>
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
              id='platform_dropdown_menu'
              type='platform'
              className='top-competition'
              setRow={setPlatform}
              select={platform}
            />
            <CompetitionDropdown
              widthPaper={400}
              heightPaper={80}
              rows={competitorList}
              multiple
              icon={competitorIcon}
              onChange={handleCompetitorChange}
              renderValue={(v) => v.map((k) => k.vendor_name).join(',')}
              renderOptions={(v) => (
                <MenuItemKit key={v.vendor_name} value={v}>
                  <CheckboxKit checked={competitor.indexOf(v) > -1} />
                  <ListItemTextKit
                    className='competitor-dropdown-list-item'
                    primary={v.vendor_name}
                  />
                </MenuItemKit>
              )}
              title='Competitor'
              className='top-competition competitor'
              select={competitor}
            />
          </div>
          <Competitor open={Open} opened={opened} platformList={platformList} />
        </div>
        <TypographyKit variant='subtitle'>
          You can select up to 5 competitors to be monitored. Competitors can be changed every 3
          months.
        </TypographyKit>
        <TableRevly
          isLoading={loading}
          headers={headersAlert}
          rows={(filteredData.length > 0 ? filteredData : competitionAlertsData).map(
            renderRowsByHeader
          )}
        />
      </PaperKit>
    </div>
  );
};

export default CompetitionAlerts;
