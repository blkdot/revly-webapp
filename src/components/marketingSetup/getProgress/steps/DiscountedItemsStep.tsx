import { InputAdornment } from '@mui/material';
import ItemMenuIcon from 'assets/images/ic_item-menu.png';
import searchIcon from 'assets/images/ic_search.png';
import MenuDropdown from 'components/settings/menu/menuDropdown/MenuDropdown';
import {
  BoxKit,
  CheckboxKit,
  FormControlKit,
  FormControlLabelKit,
  ListItemTextKit,
  MenuItemKit,
  TextfieldKit,
  TooltipKit,
  TypographyKit,
} from 'kits';
import { FC, useEffect, useState } from 'react';
import { Subtitle } from './components/Subtitle';

const TooltipCategory = ({ obj, index }) => {
  const [hoverStatus, setHover] = useState<any>(false);
  // we getting the textElement
  const textElement = document.querySelectorAll('.list-item-category')[index];
  const compareSize = () => {
    // we checking if element have 3 dots
    const compare = textElement?.children[0]?.scrollWidth > textElement?.children[0]?.clientWidth;
    // if element text dont have 3 dots we just disableHover
    setHover(compare);
  };

  useEffect(() => {
    compareSize();
    window.addEventListener('resize', compareSize);
  }, []);

  useEffect(
    () => () => {
      window.removeEventListener('resize', compareSize);
    },
    []
  );

  return (
    <div>
      <TooltipKit
        interactive={1}
        disableHoverListener={!hoverStatus}
        id='category-tooltip'
        title={obj.name}
      >
        <div>
          <ListItemTextKit className='list-item-category' primary={obj.name} />
        </div>
      </TooltipKit>
      <b>{obj.price} AED</b>
    </div>
  );
};

// eslint-disable-next-line import/prefer-default-export
export const DiscountedItemsStep: FC<{
  index: number;
  checked: any;
  setChecked: any;
  itemMenu: any;
  categorySearch: any;
  handleCategoryDataChange: any;
  categoryDataList: any;
  categoryData: any;
  filteredCategoryData: any;
  menuChanged: any;
  category: any;
}> = ({
  index,
  checked,
  setChecked,
  itemMenu,
  categorySearch,
  handleCategoryDataChange,
  categoryData,
  categoryDataList,
  filteredCategoryData,
  menuChanged,
  category,
}) => (
  <div className='left-part-middle'>
    <TypographyKit variant='h6'>{index}. Select the discounted items</TypographyKit>
    <Subtitle />
    <BoxKit
      className={`left-part-radio under-textfields radio-dates ${
        menuChanged === 'Offer on An Item from the Menu' ? 'active' : ''
      }
                  `}
    >
      <div className='radio'>
        <div>
          <span>
            <img src={ItemMenuIcon} alt='Item Menu Icon' />
          </span>
          <div>
            <div>Offer on An Item from the Menu</div>
            <p>{itemMenu}</p>
          </div>
        </div>
      </div>
      <div className='picker-duration search-filter'>
        <div>
          <TextfieldKit
            style={{ width: '45%' }}
            id='input-with-icon-textfield'
            placeholder='Search'
            onChange={categorySearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <img src={searchIcon} alt='Searh Icon' />
                </InputAdornment>
              ),
            }}
            variant='outlined'
          />
          <div style={{ width: '55%' }}>
            <div className='__select menu-item-select'>
              <MenuDropdown
                onChange={handleCategoryDataChange}
                value={categoryData}
                multiple
                renderValue={(selectedMenu) => selectedMenu.join(', ')}
                items={categoryDataList}
                label='All Categories'
                renderOption={(v) => (
                  <MenuItemKit key={v} value={v}>
                    <CheckboxKit checked={categoryData.indexOf(v) > -1} />
                    <ListItemTextKit primary={v} />
                  </MenuItemKit>
                )}
              />
            </div>
          </div>
        </div>
        <div className='max-amount'>
          <p>Maximum amount: 10</p>
          <div>
            Selected: <span>{checked.length}</span>
          </div>
        </div>
      </div>
      <FormControlKit className='category-list'>
        {(filteredCategoryData.length > 0 ? filteredCategoryData : category).map((obj, i) => (
          // TODO: FIX IT
          // <div className="menu-item-wrapper" key={obj.id} value={obj.name}>
          <div className='menu-item-wrapper' key={obj.id}>
            <FormControlLabelKit
              control={
                <CheckboxKit
                  onChange={({ target }) => {
                    if (target.checked && checked.length < 10) {
                      setChecked([...checked, target.value]);
                    } else if (!target.checked) {
                      checked.splice(checked.indexOf(target.value), 1);
                      setChecked([...checked]);
                    }
                  }}
                  checked={checked.indexOf(obj.name) > -1}
                  value={obj.name}
                />
              }
              label={<TooltipCategory index={i} obj={obj} />}
            />
          </div>
        ))}
      </FormControlKit>
    </BoxKit>
  </div>
);
