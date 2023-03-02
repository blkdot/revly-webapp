import ItemMenuIcon from 'assets/images/ic_item-menu.png';
import menuIcon from 'assets/images/ic_menu.png';
import MarketingPlaceholderDropdown from 'components/marketingSetup/MarketingPlaceholderDropdown';
import MarketingRadio from 'components/marketingSetup/MarketingRadio';
import {
  BoxKit,
  FormControlLabelKit,
  RadioGroupKit,
  RadioKit,
  SpinnerKit,
  TypographyKit,
} from 'kits';
import { FC, useEffect } from 'react';
import { Subtitle } from './components/Subtitle';

const MENU_ITEMS = [
  {
    title: 'Flash Deal',
    subtitle: "Sell Off extra stock when you're about to close",
  },
  {
    title: 'Order more , save more',
    subtitle: 'Attract larger orders from groupes and famillies',
  },
  {
    title: 'Restaurant Pick',
    subtitle: 'Promote new items or special dishes',
  },
  {
    title: 'Free Items',
    subtitle: 'Allow customers to choose a free items',
  },
];

const minOrderValues = ['0 AED', '10 AED', '20 AED', '30 AED'];
const maxOrderValues = ['20 AED', '30 AED', '40 AED'];

// eslint-disable-next-line import/prefer-default-export
export const TypeStep: FC<{
  index: number;
  menu: any;
  setMenu: any;
  itemMenu: any;
  discountPercentage: any;
  setDiscountPercentage: any;
  platform: any;
  minOrder: any;
  maxOrder: string;
  setMinOrder: any;
  setMaxOrder: any;
  setItemMenu: any;
  getDiscountMovType: any;
  menuChanged: any;
  getMenuActive: any;
  categoryLoading: boolean;
}> = ({
  index,
  menu,
  setMenu,
  itemMenu,
  discountPercentage,
  setDiscountPercentage,
  platform,
  minOrder,
  setMinOrder,
  setItemMenu,
  getDiscountMovType,
  menuChanged,
  getMenuActive,
  categoryLoading,
  maxOrder,
  setMaxOrder,
}) => {
  const getItemMenuActive = () => {
    if (categoryLoading) {
      return <SpinnerKit className='item-menu_laoding' />;
    }
    if (!getMenuActive()) {
      return <FormControlLabelKit value='Offer on An Item from the Menu' control={<RadioKit />} />;
    }
    return '';
  };

  useEffect(() => {
    if (!platform.includes('talabat')) {
      setMaxOrder('');
    }
  }, [minOrder, maxOrder]);

  const manageDiscountForm = () => {
    if (platform.includes('talabat')) {
      return (
        <div>
          <div className='dropdown-wrapper'>
            <TypographyKit className='min-max-textfields full-width' variant='div'>
              <TypographyKit variant='div'>
                Percentage Discount
                <MarketingPlaceholderDropdown
                  names={['10%', '15%', '20%', '25%', '30%', '35%', '40%', '45%', '50%']}
                  title='%'
                  setPersonName={setDiscountPercentage}
                  personName={discountPercentage}
                />
              </TypographyKit>
            </TypographyKit>
          </div>
          <div className='dropdown-wrapper'>
            <TypographyKit className='min-max-textfields' variant='div'>
              <TypographyKit variant='div'>
                Max discount amount
                <MarketingPlaceholderDropdown
                  names={maxOrderValues}
                  title='0 AED'
                  setPersonName={setMaxOrder}
                  personName={maxOrder}
                />
              </TypographyKit>
            </TypographyKit>
            <TypographyKit className='min-max-textfields' variant='div'>
              <TypographyKit variant='div'>
                Min. Order Value
                <MarketingPlaceholderDropdown
                  names={minOrderValues}
                  title='0 AED'
                  setPersonName={setMinOrder}
                  personName={minOrder}
                />
              </TypographyKit>
            </TypographyKit>
          </div>
        </div>
      );
    }

    return (
      <div className='dropdown-wrapper'>
        <TypographyKit className='min-max-textfields' variant='div'>
          <TypographyKit variant='div'>
            Percentage Discount
            <MarketingPlaceholderDropdown
              names={['10%', '15%', '20%', '25%', '30%', '35%', '40%', '45%', '50%']}
              title='%'
              setPersonName={setDiscountPercentage}
              personName={discountPercentage}
            />
          </TypographyKit>
        </TypographyKit>
        <TypographyKit className='min-max-textfields' variant='div'>
          <TypographyKit variant='div'>
            Min. Order Value
            <MarketingPlaceholderDropdown
              names={['0 AED', '10 AED', '20 AED', '30 AED', '50 AED', '75 AED', '100 AED']}
              title='0 AED'
              setPersonName={setMinOrder}
              personName={minOrder}
            />
          </TypographyKit>
        </TypographyKit>
      </div>
    );
  };
  return (
    <div className='left-part-middle'>
      <TypographyKit variant='h6'>{index}. Select the Type of the offer</TypographyKit>
      <Subtitle />
      <RadioGroupKit
        aria-labelledby='demo-radio-buttons-group-label'
        value={menu}
        onChange={(e) => setMenu(e.target.value)}
        name='radio-buttons-group-menu'
      >
        <BoxKit
          className={`left-part-radio under-textfields radio-dates ${
            menu === 'Offer on the whole Menu' ? 'active' : ''
          }
                  `}
        >
          <div className='radio'>
            <div>
              <span>
                <img src={menuIcon} alt='Menu Icon' />
              </span>
              <div>
                <div>Offer on the whole Menu</div>
                <p>Ex :&nbsp; -20% on the full menu</p>
              </div>
            </div>
            <FormControlLabelKit value='Offer on the whole Menu' control={<RadioKit />} />
          </div>
          <div style={{ width: '100%', marginTop: '0px' }}>
            <div style={{ width: '100%' }}>
              {menuChanged === 'Offer on the whole Menu' ? manageDiscountForm() : ''}
            </div>
          </div>
        </BoxKit>
        {platform.length === 1 ? (
          <BoxKit
            className={`left-part-radio under-textfields radio-dates ${
              getMenuActive() ? 'disabled' : ''
            } ${menuChanged === 'Offer on An Item from the Menu' ? 'active' : ''}
                  `}
          >
            <div className='radio'>
              <div>
                <span>
                  <img src={ItemMenuIcon} alt='Item Menu Icon' />
                </span>
                <div>
                  <div>Offer on An Item from the Menu</div>
                  <p>Ex :&nbsp; -20% on an item</p>
                </div>
              </div>
              {getItemMenuActive()}
            </div>
            <div>
              <RadioGroupKit value={itemMenu} onChange={(e) => setItemMenu(e.target.value)}>
                {(platform[0] === 'talabat' ? [] : MENU_ITEMS).map((obj) => (
                  <MarketingRadio
                    radio
                    state={itemMenu}
                    key={obj.title}
                    title={obj.title}
                    subtitle={obj.subtitle}
                  />
                ))}
                {menuChanged === 'Offer on An Item from the Menu' ? (
                  <div className='dropdown-wrapper'>
                    <TypographyKit className='min-max-textfields' variant='div'>
                      <TypographyKit variant='div'>
                        Percentage Discount
                        <MarketingPlaceholderDropdown
                          names={
                            platform[0] === 'talabat'
                              ? ['20%', '25%', '30%', '35%', '40%', '45%', '50%']
                              : getDiscountMovType('discount')
                          }
                          title='%'
                          setPersonName={setDiscountPercentage}
                          personName={discountPercentage}
                        />
                      </TypographyKit>
                    </TypographyKit>
                    <TypographyKit className='min-max-textfields' variant='div'>
                      <TypographyKit variant='div'>
                        Min. Order Value{' '}
                        {platform[0] === 'talabat' ? <span className='static'>i</span> : ''}
                        {platform[0] === 'talabat' ? (
                          <div className='get_progress_min_order'>20 AED</div>
                        ) : (
                          <MarketingPlaceholderDropdown
                            names={getDiscountMovType('mov')}
                            title='0 AED'
                            setPersonName={setMinOrder}
                            personName={minOrder}
                          />
                        )}
                      </TypographyKit>
                    </TypographyKit>
                  </div>
                ) : (
                  ''
                )}
              </RadioGroupKit>
            </div>
          </BoxKit>
        ) : (
          ''
        )}
      </RadioGroupKit>
    </div>
  );
};
