import { Arrow, Warning } from 'assets/icons';
import AdvertsWidget from 'components/advertsWidget/AdvertsWidget';
import AdvertsWidgetCustom from 'components/advertsWidget/AdvertsWidgetCustom';
import { platformObject } from 'data/platformList';
import { useVendors } from 'hooks';
import { ButtonKit, PaperKit, SkeletonKit } from 'kits';
import { CSSProperties, FC } from 'react';
// import { differenceInDays } from 'date-fns';
// import Calendar from '../../../assets/images/calendar.svg';
// import Clock from '../../../assets/images/clock.svg';
// import User from '../../../assets/images/user.svg';
import Eye from '../../assets/images/eye.svg';
import Graph from '../../assets/images/graph.svg';
import ShoppingBag from '../../assets/images/shopping-bag.svg';
import Smile from '../../assets/images/smile.svg';

const AdvertsDetails: FC<{
  data: any;
  setOpened: (value: boolean) => void;
}> = ({ data, setOpened }) => {
  const { getChainData } = useVendors();
  const vendorData = getChainData(data.chain_id, data.vendor_ids);

  const advertDetails = [
    {
      name: 'Impressions',
      title: data.impressions === null ? '-' : data.impressions,
      src: Eye,
    },
    { name: 'Orders', title: data.orders === null ? '-' : data.orders, src: ShoppingBag },
    {
      name: 'Clicks',
      title: data.clicks === null ? '-' : `${data.clicks} AED`,
      src: Graph,
    },
    { name: 'Conversion Rate', title: `${parseFloat((data.conversion_rate * 100).toFixed(2))}%` },
    {
      name: 'New Customers',
      title: data.customers === null ? '-' : data.customers,
      src: Smile,
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
  // const getAdvertsRanking = () => (
  //   <TooltipKit title='ranking' id='category-tooltip' placement='right-start' arrow>
  //     <span className='render-row-tooltip small'>0</span>
  //   </TooltipKit>
  // );
  // const advertVisibility = [
  //   {
  //     title: 'Your Swimlane ranking',
  //     content: [
  //       { title: 'Swimlane name', value: 'Name' },
  //       { title: 'Ranking', value: getAdvertsRanking() },
  //       { title: 'Duration ', value: '-' },
  //       { title: 'Promo Area', value: 'Dubai Marina' },
  //     ],
  //   },
  //   {
  //     title: 'Your Keyword ranking',
  //     content: [
  //       { title: 'Key word', value: 'Name' },
  //       { title: 'Ranking', value: getAdvertsRanking() },
  //       { title: 'Duration ', value: '-' },
  //       { title: 'Promo Area', value: 'Dubai Marina' },
  //     ],
  //   },
  //   {
  //     title: 'Your Filters ranking',
  //     content: [
  //       { title: 'Filter name', value: 'Name' },
  //       { title: 'Ranking', value: getAdvertsRanking() },
  //       { title: 'Duration ', value: '-' },
  //       { title: 'Promo Area', value: 'Dubai Marina' },
  //     ],
  //   },
  // ];

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
          value: data.start_end_date,
        },
        { title: 'Start/Ending Hour', value: data.slot },
        { title: 'Reccurence', value: 'Every day' },
      ],
    },
  ];
  const getStatus = () => {
    if (data.status === 'Upcoming') {
      return 'Scheduled';
    }
    if (data.status === 'Enabled') {
      return 'Live';
    }
    return data.status;
  };
  const renderAdvertDetails = (content) => (
    <div className='adverts-widget-custom_content'>
      {content.map((obj) => (
        <div key={obj.title}>
          <p>{obj.title}</p>
          {!obj.value ? <SkeletonKit /> : <span>{obj.value}</span>}
        </div>
      ))}
    </div>
  );
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
            <span style={{ whiteSpace: 'nowrap' }} className={`competition-status ${getStatus()}`}>
              {getStatus()}
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
                platformObject[data.platform.toLowerCase()].srcWhite ||
                platformObject[data.platform.toLowerCase()].src
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
      {/* disabled */}
      {/* <div className='adverts-details_middle-text'>
        <span>Your Advert visibility</span>
        <p>A detailed breakdown of your campaign performance</p>
      </div>
      <div className='advert_visibility'>
        {advertVisibility.map((obj) => (
          <AdvertsWidgetCustom key={obj.title} {...obj} />
        ))}
      </div> */}
      <div className='adverts-details_middle-text'>
        <span>Your Advert Settings</span>
        <p>Here are the details of the advert</p>
      </div>
      <div className='advert_settings'>
        {advertSettings.map((obj) => (
          <AdvertsWidgetCustom
            key={obj.title}
            {...obj}
            content={renderAdvertDetails(obj.content)}
          />
        ))}
      </div>
      {getStatus() === 'Live' || getStatus() === 'Scheduled' ? (
        <ButtonKit
          className='advert-cancel'
          color='error'
          variant='outlined'
          startIcon={<Warning />}
        >
          Cancel this Advert
        </ButtonKit>
      ) : (
        ''
      )}
    </PaperKit>
  );
};

export default AdvertsDetails;
