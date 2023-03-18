import MarketingRadio from 'components/marketingSetup/MarketingRadio';
import RestaurantDropdown from 'components/restaurantDropdown/RestaurantDropdown';
import { usePlatform } from 'contexts';
import { platformList } from 'data/platformList';
import { RadioGroupKit, TypographyKit } from 'kits';
import { FC } from 'react';
import { TVendors } from 'types';
import { Subtitle } from './components/Subtitle';
import VendorsDropdownOffer from './components/VendorsDropdownOffer';

// eslint-disable-next-line import/prefer-default-export
export const PlatformStep: FC<{
  index: number;
  branch: TVendors | Record<string, never>;
  getPlatform: any;
  platform: any;
}> = ({ index, branch, getPlatform, platform }) => {
  const { userPlatformData, exception } = usePlatform();

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
              userPlatformData.platforms[pf.name].length > 0 && !exception.includes(pf.name)
                ? userPlatformData.platforms[pf.name].some((obj) => obj.active)
                : false
            )
            .map((p) => (
              <MarketingRadio
                onChange={getPlatform}
                state={platform}
                key={p.name}
                className={p.name}
                icon={p.srcNoBg || p.srcWhite || p.src}
                color={p.color}
                title={p.name}
              />
            ))}
        </RadioGroupKit>
      </div>
      <VendorsDropdownOffer />
    </div>
  );
};
