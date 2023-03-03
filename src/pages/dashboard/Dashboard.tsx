import RestaurantDropdown from 'components/restaurantDropdown/RestaurantDropdown';
import RestaurantDropdownEmpty from 'components/restaurantDropdown/RestaurantDropdownEmpty';
import OnboardingModal from 'components/settings/onboarding/OnboardingModal';
import OnboardingStepper from 'components/settings/onboarding/OnboardingStepper';
import Dates from 'components/dates/Dates';
import TableRevlyNew from 'components/tableRevly/TableRevlyNew';
import dayjs from 'dayjs';
import { format, getYear } from 'date-fns';
import { enUS } from 'date-fns/locale';
import useTableContentFormatter from 'components/tableRevly/tableContentFormatter/useTableContentFormatter';
import { vendorsAtom } from 'store/vendorsAtom';
import { useDate, useMetrics, usePlatform } from 'hooks';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import './Dashboard.scss';
import { ContainerKit, TypographyKit } from 'kits';
import selectedVendors from 'components/restaurantDropdown/selectedVendors';
import Widget from 'components/widget/Widget';

const Dashboard = () => {
  const [vendors] = useAtom(vendorsAtom);
  const { vendorsObj, display, chainData } = vendors;
  const { metricsbeforePeriod, metricsafterPeriod, loading } = useMetrics(vendorsObj);
  const [table, setTable] = useState('revenue');

  const links = [
    { title: 'Revenue', link: 'revenue', tooltip: 'Revenue generated by the offer' },
    { title: 'Orders', link: 'n_orders', tooltip: '# of orders generated by the offer' },
    { title: 'Avg. basket', link: 'average_basket' },
    { title: 'Accrued discount', link: 'accrued_discounts' },
    {
      title: 'Ads spend',
      link: 'accrued_ads',
      tooltip:
        'The total budget spent on advertising (CPC and premium positions) across all platforms',
    },
    {
      title: 'Return on Ads Spend',
      link: 'roas',
      tooltip:
        'The amount of revenue earned for every AED invested in advertising (CPC, premium positions)',
    },
    {
      title: 'Net revenue',
      link: 'profit',
      tooltip: `Revenue generated by the offer minus aggregator's commission, discounts amount, ads CPC and food cost.`,
    },
    {
      title: 'Return on investment',
      link: 'roi',
      tooltip: `# AED generated in Profits for every 1 AED spent on discount. Profits are revenue minus aggregator's commission, order discount, ads CPC and food cost.`,
    },
  ];

  const [openedModal, setOpenedModal] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [branchDataUploading, setBranchDataUploading] = useState([]);
  const [branchData, setBranchData] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [connectAccount, setConnectAccount] = useState('account');
  const [connect, setConnect] = useState('');
  const openCloseModal = () => {
    setOpenedModal(!openedModal);
    if (connectAccount === 'manageBranch' || connectAccount === 'completed') {
      setConnectAccount('account');
    }
    const body = document.querySelector('body');
    const navbar = document.querySelector('.Navbar');
    if (!openedModal) {
      navbar.classList.add('openedModal');
      body.style.overflowY = 'hidden';
      return;
    }
    body.style.overflowY = 'visible';
  };
  const propsVariables = {
    openCloseModal,
    setConnect,
    connect,
    setAccounts,
    accounts,
    setBranchData,
    branchData,
    setBranchDataUploading,
    branchDataUploading,
    setActiveStep,
    activeStep,
    openedModal,
    connectAccount,
    setConnectAccount,
  };
  const { userPlatformData } = usePlatform();
  const getDropdown = () => {
    if (!userPlatformData.onboarded) {
      return <RestaurantDropdownEmpty />;
    }
    return <RestaurantDropdown />;
  };
  const { date } = useDate();
  const { typeDate } = date;
  const getPeriod = (title, period) => {
    if (title === 'custom') {
      if (typeDate === 'day') {
        return `${dayjs(period.startDate).format('DD/MM')}`;
      }
      if (typeDate === 'month') {
        return `${format(new Date(period.startDate), 'LLL', { locale: enUS })}  -  ${getYear(
          new Date(period.startDate)
        )}`;
      }

      return `${dayjs(period.startDate).format('DD/MM')} - ${dayjs(period.endDate).format(
        'DD/MM'
      )}`;
    }

    return title;
  };
  const headers = [
    {
      id: 'platform',
      numeric: false,
      disablePadding: false,
      label: 'Platform',
    },
    {
      id: 'beforePeriod',
      numeric: false,
      disablePadding: false,
      label: getPeriod(date.titleDate, date.beforePeriod),
    },
    {
      id: 'afterPeriod',
      numeric: false,
      disablePadding: true,
      label: getPeriod(date.titleafterPeriod, date.afterPeriod),
    },
    {
      id: 'evolution',
      numeric: false,
      disablePadding: true,
      label: 'Evolution',
    },
  ];

  const {
    renderPlatform,
    renderSimpleRow,
    renderPlatformSkeleton,
    renderSimpleRowSkeleton,
    renderEvolution,
    renderPercentSkeleton,
  } = useTableContentFormatter();
  const cellTemplatesObject = {
    platform: renderPlatform,
    beforePeriod: renderSimpleRow,
    afterPeriod: renderSimpleRow,
    evolution: renderEvolution,
  };
  const renderRowsByHeader = (r) =>
    headers.reduce(
      (acc, cur) => ({
        ...acc,
        [cur.id]: cellTemplatesObject[cur.id](r, cur),
        id: r.platform,
        data: r,
      }),
      {}
    );
  const cellTemplatesObjectLoading = {
    platform: renderPlatformSkeleton,
    beforePeriod: renderSimpleRowSkeleton,
    afterPeriod: renderSimpleRowSkeleton,
    evolution: renderPercentSkeleton,
  };
  const renderRowsByHeaderLoading = (r) =>
    headers.reduce(
      (acc, cur) => ({
        ...acc,
        [cur.id]: cellTemplatesObjectLoading[cur.id](cur),
        id: r,
      }),
      {}
    );
  const getNum = (metrics) => {
    if (metrics) {
      if (Number.isNaN(metrics[table]) || metrics[table] === null) {
        return '-';
      }
      if (table === 'roi') {
        return `${Math.round(metrics[table] * 100)} %`;
      }
      return parseFloat(Number(metrics[table]).toFixed(1)).toLocaleString('en-US');
    }
    return '-';
  };
  const [metrics, setMetrics] = useState([]);

  const getProcent = (metricsBefore, metricsAfter) => {
    if (metricsBefore && metricsAfter) {
      if (Number(metricsAfter) === 0) {
        return 0;
      }

      return Number(
        parseFloat((metricsBefore[table] / (metricsAfter[table] / 100) - 100).toFixed(0))
      );
    }
    return '-';
  };

  useEffect(() => {
    const platforms = [
      ...Object.keys(userPlatformData.platforms)
        .map((plat) => (userPlatformData.platforms[plat].some((obj) => obj.active) ? plat : null))
        .filter((plat) => plat),
      'all',
    ];
    const data = platforms.map((plat) => ({
      platform: plat === 'all' ? 'Total' : plat,
      beforePeriod: getNum(metricsbeforePeriod[plat]),
      afterPeriod: getNum(metricsafterPeriod[plat]),
      evolution: getProcent(metricsbeforePeriod[plat], metricsafterPeriod[plat]),
    }));
    setMetrics(data);
  }, [metricsbeforePeriod, metricsafterPeriod, table]);

  const isDisplay = () => {
    if (selectedVendors('name', display).length === chainData.length) {
      return 'all Branches';
    }
    if (selectedVendors('name', display).length > 2) {
      return `${selectedVendors('name', display).length} selected Branches`;
    }
    return selectedVendors('name', display).join(', ');
  };
  return (
    <div className='wrapper'>
      <div className='top-inputs'>
        {getDropdown()}
        <Dates isDashboard />
      </div>
      <ContainerKit>
        {!userPlatformData.onboarded && (
          <div className='dashboard-stepper'>
            <OnboardingModal propsVariables={propsVariables} />
            <OnboardingStepper
              activeStep={activeStep}
              accounts={accounts}
              openCloseModal={openCloseModal}
            />
          </div>
        )}
        <div className='block'>
          <TypographyKit className='dashboard-title'>
            {getPeriod(date.titleDate, date.beforePeriod).charAt(0).toUpperCase() +
              getPeriod(date.titleDate, date.beforePeriod).slice(1)}{' '}
            results for {isDisplay()}
          </TypographyKit>
          <TypographyKit className='dashboard-subtitle'>
            360° view of your restaurant revenue and profits
          </TypographyKit>
          <div className='dashboard-wrapper'>
            {links.map((obj: { title: string; link: string; tooltip?: string }) => (
              <Widget
                table={table}
                setTable={setTable}
                key={obj.link}
                title={obj.title}
                link={obj.link}
                metricsbeforePeriod={metricsbeforePeriod}
                metricsafterPeriod={metricsafterPeriod}
                loading={
                  metricsafterPeriod.length === 0 || metricsbeforePeriod.length === 0 || loading
                }
                links={links}
                tooltip={obj.tooltip}
              />
            ))}
          </div>
        </div>
        <TableRevlyNew
          renderCustomSkelton={[0, 1, 2].map(renderRowsByHeaderLoading)}
          isLoading={loading}
          link={table}
          setLink={setTable}
          links={links}
          headers={headers}
          rows={metrics.map(renderRowsByHeader)}
        />
      </ContainerKit>
    </div>
  );
};

export default Dashboard;
