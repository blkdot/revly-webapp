import MarketingRadio from 'components/marketingSetup/MarketingRadio';
import {
  cleanDisplay,
  cleanVendorsObj,
  fromValue,
  VendorsDropdownAdapter,
} from 'components/vendorsDropdown/adapter/VendorsDropdownAdapter';
import { usePlatform } from 'contexts';
import { platformList } from 'data/platformList';
import { RadioGroupKit, TypographyKit } from 'kits';
import { FC } from 'react';
import { TVendors } from 'types';
import { Subtitle } from './components/Subtitle';

type Value = string | number;
// eslint-disable-next-line import/prefer-default-export
export const PlatformStep: FC<{
  index: number;
  branch: TVendors | Record<string, never>;
  getPlatform: any;
  setBranch: any;
  platform: any;
}> = ({ index, branch, getPlatform, setBranch, platform }) => {
  const { userPlatformData, exception } = usePlatform();

  if (!branch || Object.keys(branch).length < 1) return null;

  const handleChange = (values: Value[]) => {
    const newDisplay = cleanDisplay(branch.display);
    const newVendorsObj = cleanVendorsObj();
    values
      .map((value) => {
        const { chain } = fromValue(value as string);
        return chain;
      })
      .filter((chain) => chain);
    const { chain: chainClicked } = fromValue(values[values.length - 1] as string);

    values.forEach((value) => {
      const { chain, vendor } = fromValue(value as string);

      newDisplay[chain][vendor].checked = false;
      if (chainClicked === chain) {
        newDisplay[chain][vendor].checked = true;
        platform.forEach((plat) => {
          newVendorsObj[plat].push(newDisplay[chain][vendor].platforms[plat]);
        });
      }
    });

    setBranch({ ...branch, display: newDisplay, vendorsObj: newVendorsObj });
  };

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
      <VendorsDropdownAdapter handleChange={handleChange} state={branch} />
    </div>
  );
};
