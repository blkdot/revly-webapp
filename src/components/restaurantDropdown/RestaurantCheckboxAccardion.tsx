import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ButtonKit, CheckboxKit, InputLabelKit, MenuItemKit, RadioKit, TooltipKit } from 'kits';
import { useEffect, useState, FC } from 'react';
import { platformList } from 'data/platformList';
import selectIcon from '../../assets/images/ic_select.png';

const RestaurantCheckboxAccordion: FC<{
  info: object;
  chainName: string;
  handleChangeVendor: any;
  index: string | number;
  setVendors: any;
  vendors: any;
  display: any;
  pageType: string;
}> = ({ info, chainName, handleChangeVendor, index, setVendors, vendors, display, pageType }) => {
  const [active, setActive] = useState(false);
  const [hoverStatusChain, setHoverChain] = useState(false);
  const [hoverStatusVendor, setHoverVendor] = useState([]);
  // we checking if all vendor in this chain are checked
  const compareSize = () => {
    // get 1 element of .chain-name
    const textElementChain = document.querySelectorAll('.chain-name')[index];
    // get all elements of .vendor-name
    const textElement = document.querySelectorAll('.vendor-name');
    // checking if scrollWidth more than clientWidth (or have 3 dots on the end of the text)
    const compare = textElementChain?.scrollWidth > textElementChain?.clientWidth;
    const compareArr = [];
    textElement.forEach((el) => {
      // checking if scrollWidth more than clientWidth (or have 3 dots on the end of the text)
      if (el?.scrollWidth > el.clientWidth) {
        // push the textContent of element
        compareArr.push(el.textContent);
      }
    });
    setHoverChain(compare);
    setHoverVendor(compareArr);
  };
  const vendorsNew = document.querySelector('#demo-multiple-checkbox-vendors-new');
  useEffect(() => {
    compareSize();
    window.addEventListener('resize', compareSize);
  }, [vendorsNew?.ariaExpanded, active, display]);

  useEffect(
    () => () => {
      window.removeEventListener('resize', compareSize);
    },
    [vendorsNew?.ariaExpanded, active, display]
  );

  const getHoverStatusVendor = (vName: string) => hoverStatusVendor.find((v) => v === vName);
  // function for vendor button "Only"
  const handleClickVendor = (e: any, vendorName: string) => {
    e.stopPropagation();
    const displayTemp = JSON.parse(JSON.stringify(display));
    const vendorsObjTemp = {};
    Object.keys(displayTemp).forEach((cName) => {
      Object.keys(displayTemp[cName]).forEach((vName) => {
        displayTemp[cName][vName].checked = false;
      });
    });
    displayTemp[chainName][vendorName].checked = true;
    Object.keys(displayTemp[chainName][vendorName].platforms).forEach((platform) => {
      if ((vendorsObjTemp[platform] || []).length === 0) {
        vendorsObjTemp[platform] = [displayTemp[chainName][vendorName].platforms[platform]];
      } else {
        vendorsObjTemp[platform].push(displayTemp[chainName][vendorName].platforms[platform]);
      }
    });
    setVendors({ ...vendors, display: displayTemp, vendorsObj: vendorsObjTemp });
  };

  const getIcon = (platform: string) =>
    platformList.find((obj) => obj.name === platform).srcFavicon;

  return (
    <div className={`checkbox-accordion-wrapper ${active && 'active'}`}>
      {Object.values(info).every((objV: any) => !objV.is_matched) ? (
        ''
      ) : (
        <div
          tabIndex={-1}
          role='presentation'
          style={{ '--length': Object.keys(info).length } as React.CSSProperties}
          className={`checkbox-accordion ${
            Object.values(info).every((objV) => objV.deleted) && 'disabled'
          } ${active && 'active'}`}
          onClick={() => setActive(!active)}
        >
          <div>
            <img
              tabIndex={-1}
              role='presentation'
              onClick={(e) => e.stopPropagation()}
              src={selectIcon}
              alt='select icon'
            />
            <div
              style={{
                cursor: 'pointer',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span style={{ height: 40 }} />
              <TooltipKit
                id='category-tooltip'
                interactive={1}
                disableHoverListener={!hoverStatusChain}
                title={chainName}
              >
                <p className='chain-name'>{chainName}</p>
              </TooltipKit>
            </div>
          </div>
          <ExpandMoreIcon style={{ cursor: 'pointer' }} />
        </div>
      )}
      {Object.keys(info).map((vendorName) => {
        if (vendorName === 'checked' || vendorName === 'active' || info[vendorName].deleted) {
          return '';
        }
        if (Object.values(info).every((objV: any) => !objV.is_matched)) {
          return (
            <div className='vendors-only' key={vendorName}>
              <MenuItemKit disabled={!info[vendorName].active}>
                <img
                  className='restaurant-img'
                  src={getIcon(Object.keys(info[vendorName].platforms)[0])}
                  alt={Object.keys(info[vendorName].platforms)[0]}
                />
                {pageType === 'listing' ? (
                  <RadioKit
                    value={vendorName}
                    onChange={({ target }) => handleChangeVendor(target, chainName)}
                    checked={info[vendorName].checked}
                  />
                ) : (
                  <CheckboxKit
                    value={vendorName}
                    onChange={({ target }) => handleChangeVendor(target, chainName)}
                    checked={info[vendorName].checked}
                  />
                )}
                <TooltipKit
                  onClick={(e) => e.stopPropagation()}
                  interactive={1}
                  disableHoverListener={!getHoverStatusVendor(vendorName)}
                  id='category-tooltip'
                  title={vendorName}
                >
                  <div role='presentation' tabIndex={-1} className='tooltip-vendor'>
                    {vendorName}
                  </div>
                </TooltipKit>
                {pageType !== 'listing' ? (
                  <div
                    role='presentation'
                    tabIndex={-1}
                    onClick={(e) => e.stopPropagation()}
                    className='only-button'
                  >
                    <ButtonKit
                      onClick={(e) => handleClickVendor(e, vendorName)}
                      variant='contained'
                    >
                      Only
                    </ButtonKit>
                  </div>
                ) : (
                  ''
                )}
              </MenuItemKit>
            </div>
          );
        }
        const sortPlatform = (a: any, b: any) => {
          if (a < b) {
            return -1;
          }
          if (a > b) {
            return 1;
          }
          return 0;
        };

        return (
          <InputLabelKit
            disabled={!info[vendorName].active}
            key={vendorName}
            className={`accordion-dropdown ${active && 'active'} `}
          >
            <div>
              {pageType === 'listing' ? (
                <RadioKit
                  disabled={!info[vendorName].active}
                  checked={info[vendorName].checked}
                  onChange={({ target }) => handleChangeVendor(target, chainName)}
                  value={vendorName}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <CheckboxKit
                  disabled={!info[vendorName].active || info[vendorName]?.deactivated}
                  checked={info[vendorName]?.deactivated ? false : info[vendorName].checked}
                  onChange={({ target }) => handleChangeVendor(target, chainName)}
                  value={vendorName}
                  onClick={(e) => e.stopPropagation()}
                />
              )}
              <TooltipKit
                id='category-tooltip'
                interactive={1}
                disableHoverListener={!getHoverStatusVendor(vendorName)}
                title={vendorName}
              >
                <p className={`vendor-name ${info[vendorName]?.deactivated && 'disabled'}`}>
                  {vendorName}
                </p>
              </TooltipKit>
              <div className='restaurant-platforms'>
                {Object.keys(info[vendorName].platforms)
                  .filter((plat) => info[vendorName].platforms[plat].metadata.is_active)
                  .sort(sortPlatform)
                  .map((plat) => (
                    <img key={plat} className='restaurant-img' src={getIcon(plat)} alt={plat} />
                  ))}
              </div>
              {pageType !== 'listing' ? (
                <div className='only-button vendor'>
                  <ButtonKit
                    disabled={!info[vendorName].active || info[vendorName].deactivated}
                    onClick={(e) => handleClickVendor(e, vendorName)}
                    variant='contained'
                  >
                    Only
                  </ButtonKit>
                </div>
              ) : (
                ''
              )}
            </div>
          </InputLabelKit>
        );
      })}
    </div>
  );
};

export default RestaurantCheckboxAccordion;
