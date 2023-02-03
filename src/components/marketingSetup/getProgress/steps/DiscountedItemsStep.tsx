import { InputAdornment } from '@mui/material';
import ItemMenuIcon from 'assets/images/ic_item-menu.png';
import searchIcon from 'assets/images/ic_search.png';
import MenuDropdown from 'components/settings/menu/menuDropdown/MenuDropdown';
import {
  BoxKit,
  ButtonKit,
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
        title={obj.name || obj.item_name}
      >
        <div>
          <ListItemTextKit className='list-item-category' primary={obj.name || obj.item_name} />
        </div>
      </TooltipKit>
      <b>{obj.price || obj.unit_price} AED</b>
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
  setCategorySearch: any;
  setFilteredCategoryData: any;
  platform: any;
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
  setCategorySearch,
  setFilteredCategoryData,
  platform,
}) =>{
  const categorySearchFunc = (e) => {
    const { value } = e.target;
    setCategorySearch(value);
    if (value === '') {
      if (categoryData.length > 0) {
        const arr = categoryData
          .map((v) => category.filter((k) => k.category_name === v || k.category === v))
          .flat();
        setFilteredCategoryData(arr);
        return;
      }
      setFilteredCategoryData([]);
      return;
    }
    const filtered = (
      filteredCategoryData.length > 0
        ? categoryData
          .map((v) => category.filter((k) => k.category_name === v || k.category === v))
          .flat()
        : category
    ).filter((obj) => (obj.name || obj.item_name).toLowerCase().includes(value.toLowerCase()));
    if (categoryData.length > 0 && filtered.length === 0) {
      const arr = categoryData
        .map((v) => category.filter((k) => k.category_name === v || k.category === v))
        .flat();
      setFilteredCategoryData(arr);
      return;
    }
    setFilteredCategoryData(filtered);
  };
  const getMaximumItem = () => {
    if (platform[0] === 'talabat') {
      if (category.length > 100) {
        return 100;
      }
      return category.length;
    }
    return 10;
  };
  const clearItems = () => {
    if (filteredCategoryData.length > 0) {
      filteredCategoryData.forEach((obj) => {
        checked.splice(
          checked.findIndex((c) => c === obj.name || c === obj.item_name),
          1
        );
      });
      setChecked([...checked]);
    } else {
      setChecked([]);
    }
  };
  const selectAllItems = () => {
    if (filteredCategoryData.length > 0) {
      checked.forEach((c, indexC) => {
        filteredCategoryData.forEach((obj) => {
          if ((obj.name || obj.item_name) === c) {
            checked.splice(indexC, 1);
          }
        });
      });
      setChecked([...checked, ...filteredCategoryData.map((obj) => obj.name || obj.item_name)]);
    } else {
      setChecked([...category.map((obj) => obj.name || obj.item_name)]);
    }
  };
  return (
  <div className='left-part-middle'>
    <TypographyKit variant='h6'>{index}. Select the discounted items</TypographyKit>
    <Subtitle />
    <BoxKit
      className={`left-part-radio under-textfields radio-dates ${menuChanged === 'Offer on An Item from the Menu' ? 'active' : ''
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
            value={categorySearch}
            onChange={categorySearchFunc}
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
        <p className='max-amount-top'>Maximum amount: {getMaximumItem()}</p>
        <div className='max-amount'>
          <div>
            Selected ({checked.length}/{getMaximumItem()})
          </div>
          {platform[0] === 'talabat' ? (
            <div className='max-amount-btns'>
              <ButtonKit
                disabled={
                  (filteredCategoryData.length > 0 ? filteredCategoryData : category)
                    .length === checked.length
                }
                onClick={selectAllItems}
                variant='outlined'
              >
                Select all
              </ButtonKit>
              <ButtonKit disabled={checked.length <= 0} onClick={clearItems} variant='text'>
                Clear
              </ButtonKit>
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
      <FormControlKit className='category-list'>
        {(filteredCategoryData.length > 0 ? filteredCategoryData : category).map(
          (obj, indexObj) => (
            // TODO: FIX IT
            // <div className='menu-item-wrapper' key={obj.id} value={obj.name}>
            <div className='menu-item-wrapper' key={obj.id || obj.item_id}>
              <FormControlLabelKit
                control={
                  <CheckboxKit
                    onChange={({ target }) => {
                      if (target.checked && checked.length < getMaximumItem()) {
                        setChecked([...checked, target.value]);
                      } else if (!target.checked) {
                        checked.splice(checked.indexOf(target.value), 1);
                        setChecked([...checked]);
                      }
                    }}
                    checked={checked.indexOf(obj.name || obj.item_name) > -1}
                    value={obj.name || obj.item_name}
                  />
                }
                label={<TooltipCategory index={indexObj} obj={obj} />}
              />
            </div>
          )
        )}
      </FormControlKit>
    </BoxKit>
  </div>
)};
