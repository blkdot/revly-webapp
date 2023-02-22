import { Arrow, Warning } from 'assets/icons';
import { platformObject } from 'data/platformList';
import { useVendors } from 'hooks';
import { ButtonKit, PaperKit, TooltipKit } from 'kits';
import { FC, CSSProperties } from 'react';
import AdvertsWidget from 'components/advertsWidget/AdvertsWidget';
import AdvertsWidgetCustom from 'components/advertsWidget/AdvertsWidgetCustom';
import { differenceInDays } from 'date-fns';

const AdvertsDetails: FC<{ data: any; setOpened: any }> = ({ data, setOpened }) => {
  const { getChainData } = useVendors();
  const vendorData = getChainData(data.chain_id, data.vendor_ids);

  const advertDetails = [
    {
      name: 'Impressions',
      ...data.impressions,
      title: data.impressions.title === null ? '-' : data.impressions.title,
    },
    { name: 'Orders', ...data.orders, title: data.orders.title === null ? '-' : data.orders.title },
    {
      name: 'Clicks',
      ...data.clicks,
      title: data.clicks.title === null ? '-' : `${data.clicks.title} AED`,
    },
    { name: 'Conversion Rate', title: `${parseFloat((data.conversion_rate * 100).toFixed(2))}%` },
    {
      name: 'New Customers',
      ...data.customers,
      title: data.customers.title === null ? '-' : data.customers.title,
    },
    { name: 'Budget Spent', title: data.spend === null ? '-' : `${data.spend} AED` },
    {
      name: 'Return on Spent',
      title: data.return_on_ad_spent === null ? '-' : `${data.return_on_ad_spent} AED`,
    },
    {
      name: 'Attributed order value',
      title: data.attributed_order_value === null ? '-' : `${data.attributed_order_value} AED`,
    },
  ];
  const getAdvertsRanking = () => (
    <TooltipKit title='ranking' id='category-tooltip' placement='right-start' arrow>
      <span className='render-row-tooltip small'>0</span>
    </TooltipKit>
  );
  const advertVisibility = [
    {
      title: 'Your Swimlane ranking',
      content: [
        { title: 'Swimlane name', value: 'Name' },
        { title: 'Ranking', value: getAdvertsRanking() },
        { title: 'Duration ', value: '-' },
        { title: 'Promo Area', value: 'Dubai Marina' },
      ],
    },
    {
      title: 'Your Keyword ranking',
      content: [
        { title: 'Key word', value: 'Name' },
        { title: 'Ranking', value: getAdvertsRanking() },
        { title: 'Duration ', value: '-' },
        { title: 'Promo Area', value: 'Dubai Marina' },
      ],
    },
    {
      title: 'Your Filters ranking',
      content: [
        { title: 'Filter name', value: 'Name' },
        { title: 'Ranking', value: getAdvertsRanking() },
        { title: 'Duration ', value: '-' },
        { title: 'Promo Area', value: 'Dubai Marina' },
      ],
    },
  ];

  const advertSettings = [
    {
      title: 'Your Advert details',
      content: [
        {
          title: 'Total budget',
          value: data.total_budget === null ? '-' : `${data.total_budget} AED`,
        },
        { title: 'Biding per Advert', value: '-' },
        {
          title: 'Days',
          value: `${
            differenceInDays(new Date(data.valid_from), new Date(data.valid_to)) + 2
          } Days ${data.start_end_date}`,
        },
        { title: 'Start/Ending Hour', value: data.start_end_hour },
        { title: 'Reccurence', value: 'Every day' },
      ],
    },
  ];
  return (
    <PaperKit className='competition-paper adverts'>
      <button onClick={() => setOpened(false)} type='button' className='back-icon'>
        <Arrow />
        <span style={{ paddingLeft: '5px' }}>Back</span>
      </button>
      <div className='adverts-details_top'>
        <div>
          <p>Branch Name</p>
          <span>{vendorData?.chain_name}</span>
        </div>
        <div>
          <p>
            Offer Status :{' '}
            <span style={{ whiteSpace: 'nowrap' }} className={`competition-status ${data.status}`}>
              {data.status === 'Upcoming' ? 'Scheduled' : data.status}
            </span>
          </p>
          <p>
            Platform :{' '}
            <img
              className='planning-platform'
              style={
                {
                  marginRight: '1.5rem',
                  '--color': platformObject[data.platform.toLowerCase()].color,
                } as CSSProperties
              }
              src={
                platformObject[data.platform.toLowerCase()].srcFaviconWhite ||
                platformObject[data.platform.toLowerCase()].srcFavicon
              }
              alt={platformObject[data.platform.toLowerCase()].name}
            />
          </p>
        </div>
      </div>
      <div className='adverts-details_top-text'>
        <span>Your Advert details</span>
        <p>Important metrics for you to monitor and track the performance of your ad campaign</p>
      </div>
      <div className='adverts-details_widgets'>
        {advertDetails.map((obj) => (
          <AdvertsWidget key={obj.name} {...obj} />
        ))}
      </div>
      <div className='adverts-details_middle-text'>
        <span>Your Advert visibility</span>
        <p>A detailed breakdown of your campaign performance</p>
      </div>
      <div className='advert_visibility'>
        {advertVisibility.map((obj) => (
          <AdvertsWidgetCustom key={obj.title} {...obj} />
        ))}
      </div>
      <div className='adverts-details_middle-text'>
        <span>Your Advert Settings</span>
        <p>Here are the details of the advert</p>
      </div>
      <div className='advert_settings'>
        {advertSettings.map((obj) => (
          <AdvertsWidgetCustom key={obj.title} {...obj} />
        ))}
      </div>
      <ButtonKit className='advert-cancel' color='error' variant='outlined' startIcon={<Warning />}>
        Cancel this Advert
      </ButtonKit>
    </PaperKit>
  );
};

export default AdvertsDetails;
