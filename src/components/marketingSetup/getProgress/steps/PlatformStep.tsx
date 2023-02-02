import BranchesIcon from 'assets/images/ic_branch.png';
import BranchMarketingDropdown from 'components/branchMarketingDropdown/BranchMarketingDropdown';
import MarketingRadio from 'components/marketingSetup/MarketingRadio';
import RestaurantDropdownNew from 'components/restaurantDropdown/RestaurantDropdownNew';
import { platformList, platformObject } from 'data/platformList';
import RadioGroupKit from 'kits/radioGroup/RadioGroupKit';
import TypographyKit from 'kits/typography/TypographyKit';
import { FC } from 'react';
import { Subtitle } from './components/Subtitle';

// eslint-disable-next-line import/prefer-default-export
export const PlatformStep: FC<{
  index: number;
  branch: {
    display: any;
    chainObj: any;
  };
  userPlatformData: {
    platforms: Record<
      string,
      {
        access_token: string;
        access_token_bis: string;
        active: boolean;
        registered: boolean;
      }
    >;
  };
  getPlatform: any;
  getPlatformData: any;
  setBranch: any;
  platformData: any;
  setBranchData: any;
  branchData: any;
  vendorsObj: any;
  platform: any;
}> = ({
  index,
  branch,
  userPlatformData,
  getPlatform,
  getPlatformData,
  setBranch,
  platformData,
  setBranchData,
  branchData,
  vendorsObj,
  platform,
}) => (
  <div className='left-part-middle'>
    <TypographyKit variant='h6'>{index}. Select platform and branches</TypographyKit>
    <Subtitle />
    <div className='left-part-radio-wrapper'>
      {Object.keys(branch.display).length > 0 ? (
        <RadioGroupKit
          aria-labelledby='demo-radio-buttons-group-label'
          name='radio-buttons-group'
          value=''
        >
          {platformList
            .filter((pf) => userPlatformData.platforms[pf.name].active)
            .map((p) => (
              <MarketingRadio
                setState={getPlatform}
                state={platform}
                checkbox
                key={p.name}
                className={p.name}
                icon={p.src}
                title={p.name}
              />
            ))}
        </RadioGroupKit>
      ) : (
        <RadioGroupKit
          aria-labelledby='demo-radio-buttons-group-label'
          name='radio-buttons-group'
          onChange={(e) => getPlatformData(e)}
          value={platformData || ''}
        >
          {platformList
            .filter((pf) => userPlatformData.platforms[pf.name].active)
            .map((p) => (
              <MarketingRadio
                state={platformData}
                key={p.name}
                className={p.name}
                icon={p.src}
                title={p.name}
              />
            ))}
        </RadioGroupKit>
      )}
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
      <BranchMarketingDropdown
        rows={vendorsObj[platformData]}
        icon={BranchesIcon}
        title='Select Branches'
        className='top-competition marketing-dropdown'
        setRow={setBranchData}
        select={branchData}
        platformData={platformObject[platformData]}
      />
    )}
  </div>
);
