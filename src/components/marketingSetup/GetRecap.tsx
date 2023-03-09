import RemoveIcon from '@mui/icons-material/Remove';
import selectedVendors from 'components/restaurantDropdown/selectedVendors';
import { format } from 'date-fns';
import { BoxKit, ButtonKit, TextfieldKit, TypographyKit } from 'kits';
import {
  platformAtom,
  selectedAtom,
  menuAtom,
  discountPercentageAtom,
  minOrderPercentageAtom,
  durationAtom,
  branchAtom,
  endingDateAtom,
  typeScheduleAtom,
  customisedDayAtom,
  timesAtom,
  everyWeekAtom,
  itemMenuAtom,
  targetAudienceAtom,
  createdAtom,
  recapAtom,
  launchOrderAtom,
  stepsAtom,
  smRuleAtom,
  stopOrderAtom,
  startingDateAtom,
} from 'store/marketingSetupAtom';
import { useAtom } from 'jotai';
import { FC, type ChangeEvent } from 'react';
import ArrowIcon from '../../assets/images/arrow.svg';
import deliveroo from '../../assets/images/deliveroo.png';
import AudienceIcon from '../../assets/images/ic_audience.png';
import CalendarCheckGrayIcon from '../../assets/images/ic_calendar-check-gray.svg';
import CalendarCloseGrayIcon from '../../assets/images/ic_calendar-close-gray.png';
import CloseIcon from '../../assets/images/ic_close.svg';
import CreatedIcon from '../../assets/images/ic_created.png';
import ItemMenuIcon from '../../assets/images/ic_item-menu.png';
import menuIcon from '../../assets/images/ic_menu.png';
import selectIcon from '../../assets/images/ic_select.png';
import TimerCheckGrayIcon from '../../assets/images/ic_timer-check-gray.png';
import TimerCloseGrayIcon from '../../assets/images/ic_timer-close-gray.png';
import TimerIcon from '../../assets/images/ic_timer.png';
import plus from '../../assets/images/plus.png';
import talabat from '../../assets/images/talabat.png';
import { getFormatedEndDate } from '../../utlls/heatmap/heatmapSelected';
import MarketingSetupStepper from '../marketingSetupStepper/MarketingSetupStepper';
import GetProgress from './MarketingGetProgress';
import MarketingPlaceholderDropdown from './MarketingPlaceholderDropdown';

type TProps = {
  closeSetup: () => void;
  // eslint-disable-next-line react/require-default-props
  ads?: boolean;
  getItemMenuNamePrice: () => { name: string; price: number }[];
};

const GetRecap: FC<TProps> = ({ closeSetup, ads, getItemMenuNamePrice }) => {
  const [platform] = useAtom(platformAtom);
  const [selected] = useAtom(selectedAtom);
  const [menu] = useAtom(menuAtom);
  const [discountPercentage] = useAtom(discountPercentageAtom);
  const [minOrder] = useAtom(minOrderPercentageAtom);
  const [duration] = useAtom(durationAtom);
  const [endingDate] = useAtom(endingDateAtom);
  const [typeSchedule] = useAtom(typeScheduleAtom);
  const [branch] = useAtom(branchAtom);
  const [customisedDay] = useAtom(customisedDayAtom);
  const [everyWeek] = useAtom(everyWeekAtom);
  const [itemMenu] = useAtom(itemMenuAtom);
  const [targetAudience] = useAtom(targetAudienceAtom);
  const [created] = useAtom(createdAtom);
  const [recap] = useAtom(recapAtom);
  const [times] = useAtom(timesAtom);
  const [launchOrder, setLaunchOrder] = useAtom(launchOrderAtom);
  const [stopOrder, setStopOrder] = useAtom(stopOrderAtom);
  const [startingDate] = useAtom(startingDateAtom);

  const [smRule] = useAtom(smRuleAtom);
  const [steps] = useAtom(stepsAtom);
  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    type: string,
    index: number,
    order?: string
  ) => {
    if (order === 'launch') {
      if (type === 'order') {
        launchOrder[index + 1] = {
          ...launchOrder[index + 1],
          [type]: launchOrder[index].order,
        };
      }
      launchOrder[index] = { ...launchOrder[index], [type]: e.target.value };
      setLaunchOrder([...launchOrder]);
    } else {
      if (type === 'order') {
        stopOrder[index + 1] = {
          ...stopOrder[index + 1],
          [type]: stopOrder[index].order,
        };
      }
      stopOrder[index] = { ...stopOrder[index], [type]: e.target.value };
      setStopOrder([...stopOrder]);
    }
  };

  if (smRule) {
    return (
      <div>
        <div className='left-part-top'>
          <div>
            <TypographyKit variant='h4'>Create a Smart Rule</TypographyKit>
            <img
              tabIndex={-1}
              role='presentation'
              onClick={() => closeSetup()}
              src={CloseIcon}
              alt='close icon'
            />
          </div>
        </div>
        <div className='left-part-middle sm-rule'>
          <TypographyKit className='left-part-subtitle' color='#637381' variant='subtitle'>
            Create and manage all your offers. Set personalised rules to automatically trigger your
            offers.
          </TypographyKit>
          <BoxKit className='left-part-radio sm-rule'>
            <TypographyKit
              className={launchOrder.length === 2 && 'active'}
              sx={{ width: '100%' }}
              variant='div'
            >
              <b>Launch the offer if the </b>
              {launchOrder.map((obj, index) =>
                index === 1 ? (
                  <div key={obj.id}>
                    <MarketingPlaceholderDropdown
                      className='sm-rule-and'
                      names={['And', 'Or']}
                      title='And'
                      personName={obj.reletion}
                      handleChange={(e) => handleChange(e, 'reletion', index, 'launch')}
                    />
                    <div className='smart-rule_drowdown'>
                      <MarketingPlaceholderDropdown
                        readOnly
                        names={['# of orders', 'Daily Revenue']}
                        title='Order'
                        personName={obj.order}
                      />
                      <MarketingPlaceholderDropdown
                        names={['>', '<']}
                        title='<'
                        personName={obj.arrow}
                        handleChange={(e) => handleChange(e, 'arrow', index, 'launch')}
                      />
                      <TextfieldKit
                        required
                        className='smart-rule-textfield'
                        placeholder='Enter a Number'
                        variant='outlined'
                        type='number'
                        onChange={({ target }) => {
                          launchOrder.splice(index, 1, { ...obj, number: target.value });
                          setLaunchOrder([...launchOrder]);
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div key={obj.id} className='smart-rule_drowdown'>
                    <MarketingPlaceholderDropdown
                      names={['# of orders', 'Daily Revenue']}
                      title='Order'
                      personName={obj.order}
                      handleChange={(e) => handleChange(e, 'order', index, 'launch')}
                    />
                    <MarketingPlaceholderDropdown
                      readOnly={launchOrder.length !== 2}
                      names={['>', '<']}
                      title='<'
                      personName={obj.arrow}
                      handleChange={(e) => handleChange(e, 'arrow', index, 'launch')}
                    />
                    <TextfieldKit
                      required
                      className='smart-rule-textfield'
                      placeholder='Enter a Number'
                      variant='outlined'
                      type='number'
                      onChange={({ target }) => {
                        launchOrder.splice(index, 1, { ...obj, number: target.value });
                        setLaunchOrder([...launchOrder]);
                      }}
                    />
                  </div>
                )
              )}
              {launchOrder.length === 2 ? (
                <ButtonKit
                  onClick={() => {
                    launchOrder.splice(1, 1);
                    setLaunchOrder([...launchOrder]);
                  }}
                  className='another-slot remove'
                >
                  <RemoveIcon width={30} height={30} sx={{ marginRight: 10 }} /> Remove rule
                </ButtonKit>
              ) : (
                <ButtonKit
                  onClick={() => {
                    setLaunchOrder([
                      ...launchOrder,
                      {
                        order:
                          launchOrder[0].order === '# of orders' ? 'Daily Revenue' : '# of orders',
                        arrow: '<',
                        number: '',
                        reletion: 'And',
                        id: 2,
                      },
                    ]);
                  }}
                  className='another-slot'
                >
                  <img src={plus} alt='plus' /> Add Rule
                </ButtonKit>
              )}
            </TypographyKit>
            <TypographyKit
              className={stopOrder.length === 2 && 'active'}
              sx={{ width: '100%' }}
              variant='div'
            >
              <b>Stop the offer if </b>
              {stopOrder.map((obj, index) =>
                index === 1 ? (
                  <div key={obj.id}>
                    <MarketingPlaceholderDropdown
                      className='sm-rule-and'
                      names={['And', 'Or']}
                      title='And'
                      personName={obj.reletion}
                      handleChange={(e) => handleChange(e, 'reletion', index)}
                    />
                    <div className='smart-rule_drowdown'>
                      <MarketingPlaceholderDropdown
                        names={['# of orders', 'Daily Revenue']}
                        title='Order'
                        personName={obj.order}
                      />
                      <MarketingPlaceholderDropdown
                        readOnly
                        names={['>', '<']}
                        title='>'
                        personName={obj.arrow}
                      />
                      <TextfieldKit
                        className='smart-rule-textfield'
                        placeholder='Enter a Number'
                        variant='outlined'
                        type='number'
                        onChange={({ target }) => {
                          stopOrder.splice(index, 1, { ...obj, number: target.value });
                          setStopOrder([...stopOrder]);
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div key={obj.id} className='smart-rule_drowdown'>
                    <MarketingPlaceholderDropdown
                      names={['# of orders', 'Daily Revenue']}
                      title='Order'
                      personName={obj.order}
                      handleChange={(e) => handleChange(e, 'order', index)}
                    />
                    <MarketingPlaceholderDropdown
                      readOnly
                      names={['>', '<']}
                      title='>'
                      personName={obj.arrow}
                    />
                    <TextfieldKit
                      className='smart-rule-textfield'
                      placeholder='Enter a Number'
                      variant='outlined'
                      type='number'
                      onChange={({ target }) => {
                        stopOrder.splice(index, 1, { ...obj, number: target.value });
                        setStopOrder([...stopOrder]);
                      }}
                    />
                  </div>
                )
              )}
              {stopOrder.length === 2 ? (
                <ButtonKit
                  onClick={() => {
                    stopOrder.splice(1, 1);
                    setStopOrder([...stopOrder]);
                  }}
                  className='another-slot remove'
                >
                  <RemoveIcon width={30} height={30} sx={{ marginRight: 10 }} /> Remove rule
                </ButtonKit>
              ) : (
                <ButtonKit
                  onClick={() => {
                    setStopOrder([
                      ...stopOrder,
                      {
                        order:
                          stopOrder[0].order === '# of orders' ? 'Daily Revenue' : '# of orders',
                        arrow: '>',
                        number: '',
                        reletion: 'And',
                        id: 2,
                      },
                    ]);
                  }}
                  className='another-slot'
                >
                  <img src={plus} alt='plus' /> Add Rule
                </ButtonKit>
              )}
            </TypographyKit>
          </BoxKit>
        </div>
      </div>
    );
  }
  if (created) {
    return (
      <div style={{ height: '100%' }}>
        <div className='left-part-top'>
          <div>
            <TypographyKit variant='h4'> </TypographyKit>

            <img
              tabIndex={-1}
              role='presentation'
              onClick={() => closeSetup()}
              src={CloseIcon}
              alt='close icon'
            />
          </div>
        </div>
        <div className='created-wrapper'>
          <img src={CreatedIcon} alt='Created Icon' />
          <TypographyKit variant='h3'>Let’s Go !!</TypographyKit>
          <p>The {ads ? 'Ads' : 'Offer'} has Been Created Successfuly</p>
        </div>
      </div>
    );
  }
  if (recap) {
    const recapChainObj = JSON.parse(JSON.stringify(branch.chainObj));
    Object.keys(recapChainObj).forEach((cName) => {
      if (Object.keys(recapChainObj[cName]).length === 0) {
        delete recapChainObj[cName];
      }
    });

    return (
      <div>
        <div className='left-part-top'>
          <div>
            <TypographyKit variant='h4'>{ads ? 'Ads' : 'Offer'} Recap </TypographyKit>

            <img
              tabIndex={-1}
              role='presentation'
              onClick={() => closeSetup()}
              src={CloseIcon}
              alt='close icon'
            />
          </div>
        </div>
        <BoxKit className='left-part-radio recap-left-part recap-left-part-inside'>
          <div>
            <img width={35} height={35} src={selectIcon} alt='select' />
            {selectedVendors('name', branch.display).join(', ')}
          </div>
          <div>
            <p>Platforms:</p>
            {platform.map((p) => (
              <img key={p} src={p === 'talabat' ? talabat : deliveroo} alt={p} />
            ))}
          </div>
        </BoxKit>
        <BoxKit className='left-part-radio recap-left-part'>
          <div className='radio recap-box-wrapper'>
            <div className='recap-box'>
              <div>
                <span>
                  <img style={{ filter: 'none' }} src={TimerIcon} alt='Timer Icon' />
                </span>
                <div>
                  <div>{duration}</div>
                  {duration === 'Program the offer duration' ? (
                    <img className='arrow-icon' style={{ left: 0 }} src={ArrowIcon} alt='arrow' />
                  ) : (
                    ''
                  )}
                </div>
                {duration === 'Program the offer duration' ? (
                  <div className='customised-column'>
                    <div>{typeSchedule}</div>
                    <p>
                      {typeSchedule === 'Customised Days' ? customisedDay.join(', ') : everyWeek}
                    </p>
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>
          <div className='radio recap-box-wrapper column'>
            <div className='recap-between'>
              <div>
                <img src={CalendarCheckGrayIcon} alt='calendar check icon' />
                <div>
                  <div>Starting Date</div>
                  <div>{format(startingDate, 'dd MMM yyyy')}</div>
                </div>
              </div>
              <div className='right'>
                <img src={CalendarCloseGrayIcon} alt='calendar close icon' />
                <div>
                  <div>Ending Date</div>
                  <div>{getFormatedEndDate(endingDate, 'dd MMM yyyy', times)}</div>
                </div>
              </div>
            </div>
          </div>
          <div className='radio recap-box-wrapper column'>
            {times.map((obj, index) => (
              <div className='recap-between' key={obj.pos}>
                <div>
                  <img src={TimerCheckGrayIcon} alt='timer check icon' />
                  <div>
                    <div>Start Time {index + 1}</div>
                    <div>
                      {format(
                        obj.startTime,
                        duration === 'Starting Now' ? 'HH:mm aaa' : 'HH:00 aaa'
                      )}
                    </div>
                  </div>
                </div>
                <div className='right'>
                  <img src={TimerCloseGrayIcon} alt='timer check icon' />
                  <div>
                    <div>End Time {index + 1}</div>
                    <div>{format(obj.endTime, 'HH:mm aaa')}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </BoxKit>
        {platform.includes('deliveroo') && (
          <BoxKit className='left-part-radio recap-left-part'>
            <div className='radio recap-box-wrapper'>
              <div className='recap-box'>
                <div>
                  <span>
                    <img style={{ filter: 'none' }} src={AudienceIcon} alt='Audience Icon' />
                  </span>
                  <div>
                    <div>Target Audience</div>
                    <img className='arrow-icon not-display' src={ArrowIcon} alt='arrow' />
                  </div>
                  <div style={{ marginLeft: 0 }}>
                    <div>{targetAudience}</div>
                  </div>
                </div>
              </div>
            </div>
          </BoxKit>
        )}
        <BoxKit className='left-part-radio under-textfields recap-left-part radio-dates active'>
          <div className='radio recap-box-wrapper'>
            <div className='recap-box'>
              <div>
                <span>
                  <img
                    className='menu-icon'
                    src={menu === 'Offer on An Item from the Menu' ? ItemMenuIcon : menuIcon}
                    alt={menu}
                  />
                </span>
                <div>
                  <div>{menu}</div>
                  {menu === 'Offer on An Item from the Menu' ? (
                    <img className='arrow-icon not-display' src={ArrowIcon} alt='arrow' />
                  ) : (
                    ''
                  )}
                </div>
                {menu === 'Offer on An Item from the Menu' ? (
                  <div style={{ marginLeft: 0 }}>
                    <div>{itemMenu}</div>
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>
          <div
            className={`radio recap-box-wrapper between under ${
              menu !== 'Offer on An Item from the Menu' && 'border-none'
            }`}
          >
            <div className='recap-between mov'>
              <div>
                <div>
                  <div>Discount rate</div>
                  <div>{discountPercentage}</div>
                </div>
              </div>
              <div className='right'>
                <div>
                  <div>Minimum Order</div>
                  <div>{minOrder}</div>
                </div>
              </div>
            </div>
            {menu === 'Offer on An Item from the Menu' ? (
              <div className='recap-between no-border'>
                {getItemMenuNamePrice().map((obj) => (
                  <div key={obj.name}>
                    <div>{obj.name}</div>
                    <div>{obj.price} AED</div>
                  </div>
                ))}
              </div>
            ) : (
              ''
            )}
          </div>
        </BoxKit>
      </div>
    );
  }

  return (
    <div>
      <div className='left-part-top'>
        <div>
          <TypographyKit variant='h4'>Set up an {ads ? 'Ads' : 'Offer'}</TypographyKit>

          <img
            tabIndex={-1}
            role='presentation'
            onClick={() => closeSetup()}
            src={CloseIcon}
            alt='close icon'
          />
        </div>
        <MarketingSetupStepper selected={selected} steps={steps} />
      </div>
      <GetProgress />
    </div>
  );
};

export default GetRecap;
