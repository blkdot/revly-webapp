import MarketingRadio from 'components/marketingSetup/MarketingRadio';
import RestaurantDropdown from 'components/restaurantDropdown/RestaurantDropdown';
import { usePlatform } from 'contexts';
import { platformList } from 'data/platformList';
import { RadioGroupKit, TypographyKit } from 'kits';
import { FC } from 'react';
import { TVendors } from 'types';
import { Subtitle } from './components/Subtitle';

// eslint-disable-next-line import/prefer-default-export
export const PlatformStep: FC<{
  index: number;
  branch: TVendors | Record<string, never>;
  getPlatform: any;
  setBranch: any;
  platform: any;
}> = ({ index, branch, getPlatform, setBranch, platform }) => {
  const { userPlatformData } = usePlatform();

  if (!branch || Object.keys(branch).length < 1) return null;

  return (
    <div className='left-part-middle'>
      <TypographyKit variant='h6'>{index}. Select platform and branches</TypographyKit>
      <Subtitle />
      <div className='left-part-radio-wrapper'>
        <RadioGroupKit
          aria-labelledby='demo-radio-buttons-group-label'
          name='radio-buttons-group'
          value=''
        >
          {platformList
            .filter((pf) =>
              userPlatformData.platforms[pf.name].length > 0
                ? userPlatformData.platforms[pf.name].some((obj) => obj.active)
                : false
            )
            .map((p) => (
              <MarketingRadio
                onChange={getPlatform}
                state={platform}
                key={p.name}
                className={p.name}
                icon={p.src}
                title={p.name}
              />
            ))}
        </RadioGroupKit>
      </div>
      <RestaurantDropdown
        className='offer-setup-dropdown'
        pageType='branch'
        setState={setBranch}
        state={branch}
      />
    </div>
  );
};
