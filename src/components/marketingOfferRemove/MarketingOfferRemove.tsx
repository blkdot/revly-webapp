import React from 'react';

import PaperKit from '../../kits/paper/PaperKit';
import TypographyKit from '../../kits/typography/TypographyKit';
import ButtonKit from '../../kits/button/ButtonKit';

import logo from '../../assets/images/small-logo.png';

const MarketingOfferRemove = (props) => {
  const { setOpened, opened, CancelOffer } = props;

  return (
    <div
      role="presentation"
      tabIndex={-1}
      onClick={() => setOpened(false)}
      className={`delete-overlay ${opened ? 'active' : ''}`}
    >
      <PaperKit onClick={(e) => e.stopPropagation()} className="marketing-paper">
        <div>
          <img src={logo} alt="logo" />
          <TypographyKit>Are you sure you want to delete this offer ?</TypographyKit>
        </div>
        <TypographyKit>
          Amet, morbi egestas ultrices id non a. Est morbi consequat quis ac, duis elit, eleifend.
          Tellus diam mi phasellus facilisi id iaculis egestas.
        </TypographyKit>
        <div>
          <ButtonKit onClick={() => CancelOffer()} variant="contained">
            Cancel Offer
          </ButtonKit>
          <ButtonKit onClick={() => setOpened(false)} variant="outlined">
            Cancel
          </ButtonKit>
        </div>
      </PaperKit>
    </div>
  );
};

export default MarketingOfferRemove;
