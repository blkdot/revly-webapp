import MarketingRadio from 'components/marketingSetup/MarketingRadio';
import RestaurantDropdownNew from 'components/restaurantDropdown/RestaurantDropdownNew';
import RestaurantDropdownOld from 'components/restaurantDropdown/RestaurantDropdownOld';
import { TVendors } from 'hooks/useVendors';
import { platformList } from 'data/platformList';
import { usePlatform } from 'hooks';
import { RadioGroupKit, TypographyKit } from 'kits';
import { FC } from 'react';
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
                ? userPlatformData.platforms[pf.name].filter((obj) => obj.active)
                : ''
            )
            .map((p) => (
              <MarketingRadio
                onChange={getPlatform}
                state={platform}
                checkbox={
                  branch && branch?.display ? Object.keys(branch.display).length > 0 : false
                }
                key={p.name}
                className={p.name}
                icon={p.src}
                title={p.name}
              />
            ))}
        </RadioGroupKit>
      </div>
      {Object.keys(branch.display).length > 0 ? (
        <RestaurantDropdownNew
          platforms={platform}
          chainObj={branch.chainObj}
          branch
          setState={setBranch}
          state={branch}
        />
      ) : (
        <RestaurantDropdownOld
          vendorsSelected={branch.vendorsSelected}
          vendors={branch.vendorsArr.filter((v) => platform.find((p) => v.platform === p))}
          setState={setBranch}
          state={branch}
          branch
          className='offer-setup-dropdown'
        />
      )}
    </div>
  );
};
