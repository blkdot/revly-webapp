import { getAlerts, getCompetitors } from 'api';
import { pascalCase } from 'change-case';
import { PageHeader } from 'components';
import Competitor from 'components/competitor/Competitor';
import Dates from 'components/dates/Dates';
import FilterBranch from 'components/filter/filterBranch/FilterBranch';
import FilterDropdown from 'components/filter/filterDropdown/FilterDropdown';
import RestaurantDropdown from 'components/restaurantDropdown/RestaurantDropdown';
import LinkRevly from 'components/linkRevly/LinkRevly';
import useTableContentFormatter from 'components/tableRevly/tableContentFormatter/useTableContentFormatter';
import TableRevlyNew from 'components/tableRevly/TableRevlyNew';
import { VendorsDropdownAdapter } from 'components/vendorsDropdown/adapter/VendorsDropdownAdapter';
import { useUser } from 'contexts';
import { platformObject } from 'data/platformList';
import dayjs from 'dayjs';
import { useAlert, useVendors } from 'hooks';
import { useAtom } from 'jotai';
import { ContainerKit, BoxKit, PaperKit } from 'kits';
import DescriptionTitle from 'kits/title/DescriptionTitle'; // TODO: add to kits export
import MainTitle from 'kits/title/MainTitle'; // TODO: add to kits export
import { useEffect, useMemo, useState } from 'react';
import Columns from '../../assets/images/columns.svg';
import competitorIcon from '../../assets/images/ic_competitor.png';
import './Competition.scss';
import {
  competitionBranchSelectedAtom,
  competitionSelectedPlatformAtom,
} from './CompetitionStoreAtom';

let fnDelays = null;

const CompetitionAlerts = () => {
  const { vendors } = useVendors();
  const { chainData } = vendors;
  const user = useUser();
  const [opened, setOpened] = useState(false);
  const [competitionAlertsData, setCompetitionAlertsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [competitorList, setCompetitorList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { triggerAlertWithMessageError } = useAlert();
  const [beforePeriodBtn, setbeforePeriodBtn] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [selectedPlatform, setSelectedPlatform] = useAtom(competitionSelectedPlatformAtom);
  const [branchSelected, setBranchSelected] = useAtom(competitionBranchSelectedAtom);
  const [selectedCompetitors, setSelectedCompetitors] = useState<string[]>([]);

  const branchActive = useMemo(
    () =>
      chainData.find(
        (chain) => chain.vendor_id === branchSelected[0] && chain.platform === selectedPlatform[0]
      ),
    [branchSelected[0], selectedPlatform[0]]
  );

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
        id: r.alert_id,
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

  const getCompetitorsDropdownContent = async (vend) => {
    const body = {
      master_email: user.email,
      access_token: user.token,
      vendors: { [selectedPlatform[0]]: [vend] },
      start_date: dayjs(beforePeriodBtn.startDate).format('YYYY-MM-DD'),
      end_date: dayjs(beforePeriodBtn.endDate).format('YYYY-MM-DD'),
    };

    const comp = await getCompetitors(body);

    setCompetitorList(comp.data ? comp.data.data : []);
    setSelectedCompetitors([]);
  };

  const filterData = () => {
    if (selectedCompetitors?.length > 0) {
      const arr = selectedCompetitors
        .map((v) => competitionAlertsData.filter((k) => k.name === v))
        .flat();

      setFilteredData(arr);
    } else {
      setFilteredData([]);
    }
  };

  useEffect(() => {
    if (!branchSelected[0] && selectedPlatform[0]) {
      const chainDefault = chainData.find((chain) => chain.platform === selectedPlatform[0]);

      if (!chainDefault) return;

      setBranchSelected([String(chainDefault.vendor_id)]);
    }
  }, [chainData, selectedPlatform[0]]);

  useEffect(() => {
    if (selectedPlatform[0] && branchSelected[0]) {
      if (!branchActive) {
        if (chainData.length > 0) {
          const localBranch = chainData.find(
            (chain) =>
              chain.vendor_id === branchSelected[0] && chain.platform === selectedPlatform[0]
          );

          if (!localBranch) {
            setBranchSelected([]);
            return;
          }

          getCompetitorsDropdownContent(localBranch.data);
        }

        return;
      }
      getCompetitorsDropdownContent(branchActive.data);
    }
  }, [selectedPlatform[0], branchSelected[0], chainData.length, beforePeriodBtn]);

  useEffect(() => {
    filterData();
  }, [selectedCompetitors]);

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
        setSelectedCompetitors([]);
        setFilteredData([]);
        setLoading(false);
        triggerAlertWithMessageError('Error while retrieving data');
      }
    }, 750);
  };

  useEffect(() => {
    if (selectedPlatform[0] && branchSelected[0]) {
      setSelectedCompetitors([]);
      if (!branchActive) {
        if (chainData.length > 0) {
          const localBranch = chainData.find(
            (chain) =>
              chain.vendor_id === branchSelected[0] && chain.platform === selectedPlatform[0]
          );

          if (!localBranch) {
            setBranchSelected([]);
            return;
          }

          getData(selectedPlatform[0], { [selectedPlatform[0]]: [localBranch.data] });
        }

        return;
      }
      getData(selectedPlatform[0], { [selectedPlatform[0]]: [branchActive.data] });
    }
  }, [selectedPlatform[0], branchSelected[0], chainData.length, beforePeriodBtn]);

  const handleCompetitorChange = (value) => {
    const isChecked = selectedCompetitors.findIndex((compet) => compet === value);

    if (isChecked >= 0) {
      setSelectedCompetitors((prev) =>
        prev.filter((compet, index) => value !== compet && prev.indexOf(compet) === index)
      );

      return;
    }

    setSelectedCompetitors((prev) =>
      [...prev, value].filter((compet, index) => [...prev, value].indexOf(compet) === index)
    );
  };

  const filterCompetitionList = competitorList?.filter(
    (compet) => compet.platform?.toLowerCase() === selectedPlatform[0].toLowerCase()
  );

  const renderPlatformInsideFilter = (s) => (
    <div key={s}>
      <img src={platformObject[s].src} alt={s} width={30} style={{ verticalAlign: 'middle' }} />
      <span style={{ verticalAlign: 'middle' }}>{pascalCase(s)}</span>
    </div>
  );

  return (
    <div className='wrapper'>
      <div className='top-inputs'>
        <VendorsDropdownAdapter />
        <Dates
          defaultTypeDate='day'
          defaultTitle='today'
          beforePeriodBtn={beforePeriodBtn}
          setbeforePeriodBtn={setbeforePeriodBtn}
        />
      </div>
      <ContainerKit>
        <PageHeader
          title='Competition - Alerts'
          description='Stay one step ahead of the game by tracking your competitors marketing actions'
          extra={
            <Competitor platformListProps={['deliveroo', 'talabat']} open={Open} opened={opened} />
          }
        />
        <PaperKit className='competition-paper'>
          <div className='competition-top-input alerts-top-inputs'>
            <div className='competition-dropdowns'>
              <FilterDropdown
                items={[
                  { text: renderPlatformInsideFilter('deliveroo'), value: 'deliveroo' },
                  // { text: renderPlatformInsideFilter('talabat'), value: 'talabat' },
                ]}
                values={selectedPlatform}
                onChange={(v) => setSelectedPlatform([v])}
                label='Show all platforms'
                icon={<img src={Columns} alt='Platform' />}
                internalIconOnActive={platformObject}
                maxShowned={1}
                mono
              />
              <FilterBranch
                items={chainData.filter(
                  (chainD) => chainD.platform === selectedPlatform[0] && chainD.is_active
                )}
                values={branchSelected}
                onChange={(v) => setBranchSelected([v])}
                icon={<img src={Columns} alt='Platform' />}
                label='Show all branches'
              />
              <FilterDropdown
                items={
                  filterCompetitionList?.map((compets) => ({
                    value: compets.vendor_name,
                    text: compets.vendor_name,
                  })) || []
                }
                values={selectedCompetitors}
                onChange={handleCompetitorChange}
                label='Show all competitors'
                customTag='competitors'
                icon={<img src={competitorIcon} alt='Competitor' />}
                disabled={!(filterCompetitionList?.length > 0)}
                maxShowned={1}
                toRight
              />
            </div>
          </div>
          <TableRevlyNew
            renderCustomSkelton={[0, 1, 2, 3, 4].map(renderRowsByHeaderLoading)}
            isLoading={loading}
            headers={headersAlert}
            rows={
              selectedCompetitors?.length > 0
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
