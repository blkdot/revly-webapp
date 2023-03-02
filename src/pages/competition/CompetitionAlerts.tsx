import { useUser } from 'contexts';
import dayjs from 'dayjs';
import { useAtom } from 'jotai';
import { vendorsIsolatedAtom } from 'store/vendorsAtom';
import { useAlert, useApi, usePlatform, useVendors } from 'hooks';
import {
  CheckboxKit,
  ContainerKit,
  ListItemTextKit,
  MenuItemKit,
  PaperKit,
  TypographyKit,
} from 'kits';
import { useEffect, useState, useCallback } from 'react';
import RestaurantDropdown from 'components/restaurantDropdown/RestaurantDropdown';
import sortedVendors from 'components/restaurantDropdown/soretedVendors';
import selectedVendors from 'components/restaurantDropdown/selectedVendors';
import TableRevlyNew from 'components/tableRevly/TableRevlyNew';
import CompetitionDropdown from 'components/competitionDropdown/CompetitionDropdown';
import Competitor from 'components/competitor/Competitor';
import Dates from 'components/dates/Dates';
import useTableContentFormatter from 'components/tableRevly/tableContentFormatter/useTableContentFormatter';
import icdeliveroo from '../../assets/images/deliveroo-favicon.webp';
import competitorIcon from '../../assets/images/ic_competitor.png';
import PlatformIcon from '../../assets/images/ic_select_platform.png';
import ictalabat from '../../assets/images/talabat-favicon.png';
import './Competition.scss';

let fnDelays = null;

const CompetitionAlerts = () => {
  const { vendors } = useVendors();
  const [vendorsData, setVendorsData] = useAtom(vendorsIsolatedAtom);
  const [platformList, setPlatformList] = useState([]);
  const user = useUser();
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
      label: 'Competitor',
    },
    {
      id: 'type',
      numeric: false,
      disablePadding: true,
      label: 'Discount type',
    },
    {
      id: 'alert',
      numeric: false,
      disablePadding: true,
      label: 'Alert',
    },
    {
      id: 'start_end_date',
      numeric: false,
      disablePadding: true,
      label: 'Start - end date',
    },
    {
      id: 'slot',
      numeric: false,
      disablePadding: true,
      label: 'Slot',
      tooltip: 'Daily start and end hour of your offer, and the # of hours it is running daily.',
    },
    {
      id: 'status',
      numeric: false,
      disablePadding: true,
      label: 'Status',
    },
  ];

  const {
    renderStatus,
    renderSimpleRow,
    renderSimpleIconRow,
    renderSimpleRowSkeleton,
    renderPercentSkeleton,
    renderPercent,
  } = useTableContentFormatter();

  const cellTemplatesObject = {
    name: renderSimpleRow,
    type: renderSimpleRow,
    alert: renderPercent,
    start_end_date: renderSimpleIconRow,
    slot: renderSimpleIconRow,
    status: renderStatus,
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

  const cellTemplatesObjectLoading = {
    name: renderSimpleRowSkeleton,
    type: renderSimpleRowSkeleton,
    alert: renderPercentSkeleton,
    start_end_date: renderSimpleRowSkeleton,
    slot: renderSimpleRowSkeleton,
    status: renderPercentSkeleton,
  };
  const renderRowsByHeaderLoading = (r) =>
    headersAlert.reduce(
      (acc, cur) => ({
        ...acc,
        [cur.id]: cellTemplatesObjectLoading[cur.id](cur),
        id: r,
      }),
      {}
    );

  const initVendorsDataSelection = useCallback(() => {
    const usedVendors = vendorsData.display;

    const displayTemp = JSON.parse(JSON.stringify(usedVendors));
    let counter = 0;
    let defaultSelection = null;

    sortedVendors(displayTemp).forEach((chainName) => {
      const isAllChecked = Object.values(displayTemp[chainName]).every(
        (vendorObj: any) => vendorObj?.checked
      );

      Object.keys(displayTemp[chainName]).forEach((vendorName) => {
        displayTemp[chainName][vendorName].checked = isAllChecked
          ? false
          : displayTemp[chainName][vendorName].checked;

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
  }, [vendors]);

  useEffect(() => {
    initVendorsDataSelection();
  }, [platform, vendors]);

  const getCompetitorsDropdownContent = async () => {
    const body = {
      master_email: user.email,
      access_token: user.token,
      vendors: { [platform]: vendors.vendorsObj[platform] },
      start_date: dayjs(beforePeriodBtn.startDate).format('YYYY-MM-DD'),
      end_date: dayjs(beforePeriodBtn.endDate).format('YYYY-MM-DD'),
    };

    const comp = await getCompetitors(body);

    setCompetitorList(comp.data ? comp.data.data : []);
    setCompetitor([]);
  };

  const filterData = () => {
    if (competitor?.length > 0) {
      const arr = competitor
        .map((v) => competitionAlertsData.filter((k) => k.name === v.vendor_name))
        .flat();

      setFilteredData(arr);
    } else {
      setFilteredData([]);
    }
  };

  useEffect(() => {
    getCompetitorsDropdownContent();
  }, [vendors]);

  useEffect(() => {
    filterData();
  }, [competitor]);

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
          access_token: user.token,
          vendors: vend || {},
          start_date: dayjs(beforePeriodBtn.startDate).format('YYYY-MM-DD'),
          end_date: dayjs(beforePeriodBtn.endDate).format('YYYY-MM-DD'),
        };
        const alerts = await getAlerts(body, plat);

        const filt = alerts.data?.data
          .map((v) => ({
            name: v.vendor_name,
            type: v.discount_type,
            alert: v.discount,
            minimum_order_value: v.minimum_order_value,
            start_date: v.start_date,
            end_date: v.end_date,
            start_hour: v.start_hour,
            end_hour: v.end_hour,
            status: v.status,
            id: v.alert_id,
            start_end_date: `${dayjs(new Date(v.start_date)).format('DD/MM')} - ${
              v.end_date ? dayjs(new Date(v.end_date)).format('DD/MM') : 'undetermined'
            }`,
            slot: `${dayjs(new Date(v.start_date)).format('HH:mm')} - ${
              v.end_date ? dayjs(new Date(v.end_date)).format('HH:mm') : 'undetermined'
            }`,
          }))
          .sort((a, b) => a.status - b.status);
        setCompetitionAlertsData(filt || []);
        setFilteredData(filt || []);
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
    if (platform && vendorsData.vendorsArr.length) {
      setCompetitor([]);
      getData(platform, { [platform]: vendorsData.vendorsObj[platform] });
    }
  }, [platform, vendorsData, beforePeriodBtn]);

  const handleCompetitorChange = (e) => {
    const { value } = e.target;

    setCompetitor(value);
  };

  const filterCompetitionList = competitorList?.filter(
    (compet) => compet.platform?.toLowerCase() === platform?.toLowerCase()
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
      <ContainerKit>
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
              <div className='listing-vendors top-competition'>
                <RestaurantDropdown
                  pageType='listing'
                  state={vendorsData}
                  setState={setVendorsData}
                />
              </div>
              <CompetitionDropdown
                widthPaper={400}
                heightPaper={80}
                rows={filterCompetitionList || []}
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
          <TableRevlyNew
            renderCustomSkelton={[0, 1, 2, 3, 4].map(renderRowsByHeaderLoading)}
            isLoading={loading}
            headers={headersAlert}
            rows={
              competitor?.length > 0
                ? filteredData.map(renderRowsByHeader)
                : competitionAlertsData.map(renderRowsByHeader)
            }
            className='competition-alerts'
          />
        </PaperKit>
      </ContainerKit>
    </div>
  );
};

export default CompetitionAlerts;
