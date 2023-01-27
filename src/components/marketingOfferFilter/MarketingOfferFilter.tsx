import ButtonKit from '../../kits/button/ButtonKit';
import CheckboxKit from '../../kits/checkbox/CheckboxKit';
import PaperKit from '../../kits/paper/PaperKit';
import TextfieldKit from '../../kits/textfield/TextfieldKit';
import TypographyKit from '../../kits/typography/TypographyKit';

import Basket from '../../assets/icons/Basket';
import Layers from '../../assets/icons/Layers';
import Switch from '../../assets/icons/Switch';
import Tag from '../../assets/icons/Tag';
import UserGroup from '../../assets/icons/UserGroup';
import CloseIcon from '../../assets/images/ic_close.png';

const MarketingOfferFilter = (props: any) => {
  const {
    CloseFilterPopup,
    openedFilter,
    filtersHead,
    filters,
    handleChangeMultipleFilter,
    avgBasketRange,
    setAvgBasketRange,
  } = props;

  const renderAvgBasketFilter = () => {
    if (!avgBasketRange || !setAvgBasketRange) return null;

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          marginTop: '2rem',
          flexDirection: 'column',
        }}
      >
        <span
          style={{
            fontSize: '13px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Basket />
          &nbsp; Avg Basket
        </span>
        <div style={{ display: 'flex', width: '100%' }}>
          <div
            style={{
              marginRight: '0.5rem',
              marginTop: '1rem',
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
            }}
          >
            <span style={{ fontSize: '12px' }}>Min</span>
            <TextfieldKit
              placeholder="$ 0"
              type="number"
              value={avgBasketRange.min}
              onChange={(e) => setAvgBasketRange({ ...avgBasketRange, min: e.target.value })}
            />
          </div>
          <div
            style={{
              marginTop: '1rem',
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
            }}
          >
            <span style={{ fontSize: '12px' }}>Max</span>
            <TextfieldKit
              placeholder="-"
              type="number"
              value={avgBasketRange.max}
              onChange={(e) => setAvgBasketRange({ ...avgBasketRange, max: e.target.value })}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderTargetFilter = () => {
    if (!filtersHead.target) return null;

    return (
      <>
        <hr />
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            marginTop: '2rem',
            flexDirection: 'column',
          }}
        >
          <span
            style={{
              fontSize: '13px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <UserGroup />
            &nbsp; Target
          </span>
          <div style={{ display: 'flex', width: '100%', flexWrap: 'wrap' }}>
            {filtersHead.target.map((item) => (
              <div
                key={item.value}
                style={{
                  display: 'flex',
                  alignSelf: 'center',
                  fontWeight: 'bold',
                  marginRight: '1rem',
                  marginTop: '1rem',
                  width: '42%',
                }}
              >
                <CheckboxKit
                  checked={filters.target.includes(item.value) || false}
                  onChange={() => handleChangeMultipleFilter('target')(item.value)}
                />
                <span style={{ display: 'flex', alignSelf: 'center' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  const renderDiscountType = () => {
    if (!filtersHead.discount_type || filtersHead.discount_type.length < 1) return null;

    return (
      <>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            marginTop: '2rem',
            flexDirection: 'column',
          }}
        >
          <span style={{ fontSize: '13px', fontWeight: 'bold' }}>
            <Tag /> Discount Type
          </span>
          <div style={{ display: 'flex', width: '100%', flexWrap: 'wrap' }}>
            {filtersHead.discount_type.map((item) => (
              <div
                key={item.value}
                style={{
                  display: 'flex',
                  alignSelf: 'center',
                  fontWeight: 'bold',
                  marginRight: '1rem',
                  marginTop: '1rem',
                  width: '80%',
                }}
              >
                <CheckboxKit
                  checked={filters.discount_type.includes(item.value)}
                  onChange={() => handleChangeMultipleFilter('discount_type')(item.value)}
                />
                <span style={{ display: 'flex', alignSelf: 'center' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
        <hr />
      </>
    );
  };

  const renderDiscountAmount = () => {
    if (!filtersHead.discount_rate || filtersHead.discount_rate.length < 1) return null;

    return (
      <>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            marginTop: '2rem',
            flexDirection: 'column',
          }}
        >
          <span style={{ fontSize: '13px', fontWeight: 'bold' }}>
            <Tag /> Discount Amount %
          </span>
          <div style={{ display: 'flex', width: '100%', flexWrap: 'wrap' }}>
            {filtersHead.discount_rate.map((item) => (
              <div
                key={item.value}
                style={{
                  display: 'flex',
                  alignSelf: 'center',
                  fontWeight: 'bold',
                  marginRight: '1rem',
                  marginTop: '1rem',
                  width: '18%',
                }}
              >
                <CheckboxKit
                  checked={filters.discount_rate.includes(item.value)}
                  onChange={() => handleChangeMultipleFilter('discount_rate')(item.value)}
                />
                <span style={{ display: 'flex', alignItems: 'center' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
        <hr />
      </>
    );
  };

  return (
    <div
      role="presentation"
      tabIndex={-1}
      onClick={() => CloseFilterPopup(true)}
      className={`filter-overlay${openedFilter ? ' active' : ''}`}
    >
      <PaperKit onClick={(e) => e.stopPropagation()} className="marketing-paper filter-paper">
        <div>
          <TypographyKit>More Filters</TypographyKit>
          <img
            role="presentation"
            tabIndex={-1}
            onClick={() => CloseFilterPopup(true)}
            src={CloseIcon}
            alt="close icon"
          />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            marginTop: '2rem',
            flexDirection: 'column',
          }}
        >
          <span style={{ fontSize: '13px', fontWeight: 'bold' }}>
            <Layers /> Platform
          </span>
          <div style={{ display: 'flex', width: '100%', flexWrap: 'wrap' }}>
            {filtersHead.platform.map((item) => (
              <div
                key={item.value}
                style={{
                  display: 'flex',
                  alignSelf: 'center',
                  fontWeight: 'bold',
                  width: '42%',
                }}
              >
                <CheckboxKit
                  checked={filters.platform.includes(item.value)}
                  onChange={() => handleChangeMultipleFilter('platform')(item.value)}
                />
                <span style={{ alignSelf: 'center' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
        <hr />
        {renderDiscountType()}
        {renderDiscountAmount()}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            marginTop: '2rem',
            flexDirection: 'column',
          }}
        >
          <span
            style={{
              fontSize: '13px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Switch />
            &nbsp; Status
          </span>
          <div style={{ display: 'flex', width: '100%', flexWrap: 'wrap' }}>
            {filtersHead.status.map((item) => (
              <div
                key={item.value}
                style={{
                  display: 'flex',
                  alignSelf: 'center',
                  fontWeight: 'bold',
                  marginRight: '1rem',
                  marginTop: '1rem',
                  width: '42%',
                }}
              >
                <CheckboxKit
                  checked={filters.status.includes(item.value) || false}
                  onChange={() => handleChangeMultipleFilter('status')(item.value)}
                />
                <span style={{ display: 'flex', alignSelf: 'center' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
        {renderTargetFilter()}
        {renderAvgBasketFilter()}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <ButtonKit
            variant="contained"
            style={{ marginRight: '1rem' }}
            onClick={() => CloseFilterPopup(false)}
          >
            Confirm and Filter
          </ButtonKit>
          <ButtonKit variant="outlined" onClick={() => CloseFilterPopup(true)}>
            Cancel
          </ButtonKit>
        </div>
      </PaperKit>
    </div>
  );
};

export default MarketingOfferFilter;
