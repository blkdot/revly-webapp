import arrow from 'assets/images/arrow.svg';
import AdvertsCreateNewCampaign from 'components/createNewCampaign/AdvertsCreateNewCampaign';
import AdvertsDetails from 'components/details/AdvertsDetails';
import selectedVendors from 'components/restaurantDropdown/selectedVendors';
import useTableContentFormatter from 'components/tableRevly/tableContentFormatter/useTableContentFormatter';
import TableRevlyNew from 'components/tableRevly/TableRevlyNew';
import { DateRange, useDates } from 'contexts';
import { endOfMonth, endOfWeek, format, getYear } from 'date-fns';
import { enUS } from 'date-fns/locale';
import dayjs from 'dayjs';
import { useMarketingSetup, usePlanningAdsNew, useVendors } from 'hooks';
import { useAtom } from 'jotai';
import { ButtonKit, ContainerKit, TypographyKit } from 'kits';
import { useEffect, useMemo, useState } from 'react';
import { branchAtom } from 'store/marketingSetupAtom';
import './Adverts.scss';

const getOfferDate = (period: DateRange, type: string): Date => {
  if (type === 'month') {
    return endOfMonth(period.until.toDate());
  }

  if (type === 'week') {
    return endOfWeek(period.until.toDate(), { weekStartsOn: 1 });
  }

  return period.until.toDate();
};

const Adverts = () => {
  const { current, currentTitle, calendar } = useDates();
  const { vendors } = useVendors();
  const { display, vendorsArr } = vendors;
  const [disabled, setDisabled] = useState(true);
  const [branchVendors, setBranchVendors] = useAtom(branchAtom);
  const platform = ['deliveroo'];
  const { setVendors } = useMarketingSetup();
  useEffect(() => {
    const displayTemp = JSON.parse(JSON.stringify(vendors.display));
    setVendors(displayTemp, setBranchVendors, branchVendors, platform);
    if (selectedVendors('name', displayTemp).length > 0) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendors]);
  const [link, setLink] = useState('ads_management');
  const startDate = current.from.toDate();
  const endDate = getOfferDate(current, calendar);
  const startLocal = startDate.toLocaleDateString();
  const endLocal = endDate.toLocaleDateString();
  const startGetDate = startDate.getDate();
  const endGetDate = endDate.getDate();

  const getBeforePeriod = () => {
    if (currentTitle === 'custom') {
      if (startLocal === endLocal) {
        return `${dayjs(startDate).format('DD/MM')}`;
      }
      if (startGetDate === 1 && endGetDate === endOfMonth(startDate).getDate()) {
        return `${format(startDate, 'LLL', { locale: enUS })}  -  ${getYear(startDate)}`;
      }

      return `${dayjs(startDate).format('DD/MM')} - ${dayjs(endDate).format('DD/MM')}`;
    }

    return `${currentTitle}`;
  };
  const isDisplay = () => {
    if (selectedVendors('name', display).length === vendorsArr.length) {
      return 'All Points of sales';
    }
    if (selectedVendors('name', display).length > 2) {
      return `${selectedVendors('name', display).length} selected vendors`;
    }
    return selectedVendors('name', display).join(', ');
  };
  const { data, isLoading: isLoadingAds } = usePlanningAdsNew({ startDate, endDate });

  const ads = useMemo(() => data?.ads || [], [data]);

  const [adsData, setAdsData] = useState([]);
  useEffect(() => {
    const newArr = ads.map((obj) => ({
      ...obj,
      start_end_date: `${dayjs(obj.valid_from).format('DD/MM')} - ${dayjs(obj.valid_to).format(
        'DD/MM'
      )}`,
      slot: `${dayjs(obj.valid_from).format('HH:mm')} - ${dayjs(obj.valid_to).format('HH:mm')}`,
      impressions: obj.ad_serving_count,
      orders: obj.orders_count,
      clicks: obj.clicks_count,
      customers: obj.new_customers_count,
      spent_total:
        obj.spend === null || obj.total_budget === null ? null : `${obj.spend}/${obj.total_budget}`,
    }));
    setAdsData(newArr);
  }, [ads]);
  const headersList = [
    { id: 'chain_id', disablePadding: true, label: 'Brand name' },
    { id: 'vendor_ids', disablePadding: true, label: 'Branches' },
    { id: 'start_end_date', disablePadding: true, label: 'Start - end date' },
    {
      id: 'slot',
      disablePadding: true,
      label: 'Slot',
      tooltip: 'Daily start and end hour of your offer, and the # of hours it is running daily.',
    },
    { id: 'platform', disablePadding: true, label: 'Platform' },
    {
      id: 'spent_total',
      disablePadding: true,
      label: 'Budget spent - total',
      tooltip: 'Used budget compared to the defined budget',
    },
    {
      id: 'cost_per_click',
      disablePadding: true,
      label: 'Cost Per Click',
      tooltip:
        'Commonly referred to as CPC. You can either set the CPC manually or let the aggregator set a dynamic CPC, only available on Deliveroo.',
    },
    { id: 'status', disablePadding: true, label: 'Status' },
  ];
  const headersPerformance = [
    { id: 'chain_id', disablePadding: true, label: 'Brand name' },
    { id: 'vendor_ids', disablePadding: true, label: 'Branches' },
    { id: 'platform', disablePadding: true, label: 'Platform' },
    { id: 'impressions', disablePadding: true, label: 'Impressions' },
    { id: 'orders', disablePadding: true, label: 'Orders' },
    { id: 'attributed_order_value', disablePadding: true, label: 'Attributed order value' },
    { id: 'clicks', disablePadding: true, label: 'Clicks' },
    { id: 'conversion_rate', disablePadding: true, label: 'Conversion rate' },
    { id: 'customers', disablePadding: true, label: 'New customers' },
    { id: 'status', disablePadding: true, label: 'Status' },
  ];
  const {
    renderCurrency,
    renderStatus,
    renderChainId,
    renderVendorId,
    renderPlatform,
    renderCalculatedPercent,
    renderSimpleIconRow,
    renderSimpleRowSkeleton,
    renderPlatformSkeleton,
    renderPercentSkeleton,
  } = useTableContentFormatter();
  const cellTemplatesObject = {
    chain_id: renderChainId,
    vendor_ids: renderVendorId,
    start_end_date: renderSimpleIconRow,
    slot: renderSimpleIconRow,
    spent_total: renderCurrency,
    cost_per_click: renderCurrency,
    platform: renderPlatform,
    impressions: renderSimpleIconRow,
    orders: renderSimpleIconRow,
    attributed_order_value: renderCurrency,
    clicks: renderSimpleIconRow,
    conversion_rate: renderCalculatedPercent,
    customers: renderSimpleIconRow,
    status: renderStatus,
  };

  const renderRowsByHeaderList = (r) =>
    (link === 'ads_management' ? headersList : headersPerformance).reduce(
      (acc, cur) => ({
        ...acc,
        [cur.id]: cellTemplatesObject[cur.id]({ ...r, id: r.master_ad_id }, cur),
        id: `${r.ad_ids.join('')}_ads`,
        data: r,
      }),
      {}
    );
  const cellTemplatesObjectLoading = {
    chain_id: renderSimpleRowSkeleton,
    vendor_ids: renderPlatformSkeleton,
    start_end_date: renderSimpleRowSkeleton,
    slot: renderSimpleRowSkeleton,
    spent_total: renderSimpleRowSkeleton,
    platform: renderPlatformSkeleton,
    impressions: renderSimpleRowSkeleton,
    orders: renderSimpleRowSkeleton,
    attributed_order_value: renderSimpleRowSkeleton,
    clicks: renderSimpleRowSkeleton,
    conversion_rate: renderSimpleRowSkeleton,
    customers: renderSimpleRowSkeleton,
    status: renderPercentSkeleton,
    cost_per_click: renderSimpleRowSkeleton,
  };

  const renderRowsByHeaderListLoading = (r) =>
    (link === 'ads_management' ? headersList : headersPerformance).reduce(
      (acc, cur) => ({
        ...acc,
        [cur.id]: cellTemplatesObjectLoading[cur.id](cur),
        id: r,
      }),
      {}
    );
  const [openedCampaign, setOpenedCampaign] = useState(false);
  const [opened, setOpened] = useState(false);
  const [clickedRow, setClickedRow] = useState({});
  const links = [
    { title: 'Ads management', link: 'ads_management' },
    { title: 'Ads performance', link: 'ads_performance' },
  ];
  const renderLayout = () => {
    if (openedCampaign) {
      return <AdvertsCreateNewCampaign setOpened={setOpenedCampaign} />;
    }
    if (opened) {
      return (
        <ContainerKit>
          <AdvertsDetails data={clickedRow} setOpened={setOpened} />
        </ContainerKit>
      );
    }
    return (
      <ContainerKit>
        <div>
          <div className='adverts_top-titles'>
            <div>
              <TypographyKit className='adverts-title' variant='subtitle'>
                Manage Advertisements for
                <span>{isDisplay()}</span>
                for
                <span>{getBeforePeriod()}</span>
              </TypographyKit>
              <p>
                Here you can quickly and easily create and manage effective advertisements for their
                businesses.
              </p>
            </div>
            <ButtonKit disabled={disabled} onClick={() => setOpenedCampaign(true)}>
              Create new campaign
              <img src={arrow} alt='right-arrow' />
            </ButtonKit>
          </div>
          <TableRevlyNew
            onClickRow={(id) => {
              setClickedRow(adsData.find((obj) => `${obj.ad_ids.join('')}_ads` === id));
              setOpened(true);
            }}
            link={link}
            setLink={setLink}
            links={links}
            renderCustomSkelton={[0, 1, 2, 3, 4].map(renderRowsByHeaderListLoading)}
            isLoading={isLoadingAds}
            headers={link === 'ads_management' ? headersList : headersPerformance}
            rows={adsData.map(renderRowsByHeaderList)}
            noDataText='No ads has been retrieved.'
          />
        </div>
      </ContainerKit>
    );
  };
  return <div className='wrapper'>{renderLayout()}</div>;
};

export default Adverts;
