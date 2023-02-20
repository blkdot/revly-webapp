import RestaurantDropdown from 'components/restaurantDropdown/RestaurantDropdown';
import RestaurantDropdownEmpty from 'components/restaurantDropdown/RestaurantDropdownEmpty';
import OnboardingModal from 'components/settings/onboarding/OnboardingModal';
import OnboardingStepper from 'components/settings/onboarding/OnboardingStepper';
import Dates from 'components/dates/Dates';
import Finance from 'components/finance/Finance';
import FinanceEmpty from 'components/finance/FinanceEmpty';
import Marketing from 'components/marketing/Marketing';
import MarketingEmpty from 'components/marketing/MarketingEmpty';
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

const Dashboard = () => {
  const [vendors] = useAtom(vendorsAtom);
  const { display, vendorsArr, vendorsObj } = vendors;
  const { metricsbeforePeriod, metricsafterPeriod, loading } = useMetrics(vendorsObj);
  const [table, setTable] = useState('Revenue');

  const links = ['Revenue', 'Orders', 'Avg. basket', 'Net revenue', 'Accrued discount', 'ROI'];
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
  const getType = () => {
    const title = table.toLocaleLowerCase();
    if (title === 'orders') return 'n_orders';
    if (title === 'avg. basket') return 'average_basket';
    if (title === 'accrued discount') return 'accrued_discounts';
    if (title === 'net revenue') return 'profit';
    return title;
  };
  const { renderPlatform, renderSimpleRow, renderPlatformSkeleton, renderSimpleRowSkeleton } =
    useTableContentFormatter();
  const cellTemplatesObject = {
    platform: renderPlatform,
    beforePeriod: renderSimpleRow,
    afterPeriod: renderSimpleRow,
    evolution: renderSimpleRow,
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
  const cellTemplatesObjectLoding = {
    platform: renderPlatformSkeleton,
    beforePeriod: renderSimpleRowSkeleton,
    afterPeriod: renderSimpleRowSkeleton,
    evolution: renderSimpleRowSkeleton,
  };
  const renderRowsByHeaderLoading = (r) =>
    headers.reduce(
      (acc, cur) => ({
        ...acc,
        [cur.id]: cellTemplatesObjectLoding[cur.id](cur),
        id: r,
      }),
      {}
    );
  const getNum = (metrics) => {
    if (metrics) {
      if (Number.isNaN(metrics[getType()]) || metrics[getType()] === null) {
        return '-';
      }
      if (getType() === 'roi') {
        return `${Math.round(metrics[getType()] * 100)} %`;
      }
      return parseFloat(Number(metrics[getType()]).toFixed(1)).toLocaleString('en-US');
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
        parseFloat((metricsBefore[getType()] / (metricsAfter[getType()] / 100) - 100).toFixed(0))
      );
    }
    return '-';
  };
  const evolution = (procent) => {
    if (Number.isNaN(procent) || procent === '-' || procent === null) {
      return '-';
    }
    if (procent > 0) {
      return `+ ${procent}%`;
    }
    return `${procent}%`;
  };
  useEffect(() => {
    const platforms = [
      ...Object.keys(userPlatformData.platforms).map(
        (plat) => userPlatformData.platforms[plat].some((obj) => obj.active) && plat
      ),
      'all',
    ];
    const data = platforms.map((plat) => ({
      platform: plat === 'all' ? 'Total' : plat,
      beforePeriod: getNum(metricsbeforePeriod[plat]),
      afterPeriod: getNum(metricsafterPeriod[plat]),
      evolution: evolution(getProcent(metricsbeforePeriod[plat], metricsafterPeriod[plat])),
    }));
    setMetrics(data);
  }, [metricsbeforePeriod, metricsafterPeriod]);
  return (
    <div className='wrapper'>
      <div className='top-inputs'>
        {getDropdown()}
        <Dates isDashboard />
      </div>
      {!userPlatformData.onboarded ? (
        <div className='dashboard-stepper'>
          <OnboardingModal propsVariables={propsVariables} />
          <OnboardingStepper
            activeStep={activeStep}
            accounts={accounts}
            openCloseModal={openCloseModal}
          />
        </div>
      ) : (
        ''
      )}
      {metricsbeforePeriod.length !== 0 &&
      metricsafterPeriod.length !== 0 &&
      !loading &&
      userPlatformData.onboarded ? (
        <Finance
          setTable={setTable}
          table={getType()}
          metricsbeforePeriod={metricsbeforePeriod}
          metricsafterPeriod={metricsafterPeriod}
          display={display}
          vendors={vendorsArr}
          loading={loading}
        />
      ) : (
        <FinanceEmpty />
      )}
      {metricsbeforePeriod.length !== 0 &&
      metricsafterPeriod.length !== 0 &&
      !loading &&
      userPlatformData.onboarded ? (
        <Marketing
          setTable={setTable}
          table={getType()}
          metricsbeforePeriod={metricsbeforePeriod}
          metricsafterPeriod={metricsafterPeriod}
          loading={loading}
        />
      ) : (
        <MarketingEmpty />
      )}
      <TableRevlyNew
        renderCustomSkelton={[0, 1, 2].map(renderRowsByHeaderLoading)}
        isLoading={loading}
        link={table}
        setLink={setTable}
        links={links}
        headers={headers}
        rows={metrics.map(renderRowsByHeader)}
      />
    </div>
  );
};

export default Dashboard;
