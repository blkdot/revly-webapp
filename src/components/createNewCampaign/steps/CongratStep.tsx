import { Arrow } from 'assets/icons';
import { ButtonKit } from 'kits';
import { FC } from 'react';
import Congrats from '../../../assets/images/congrats.gif';

const CongratStep: FC<{
  setStep: (v: string) => void;
  setOpened: (v: boolean) => void;
}> = ({ setOpened, setStep }) => (
  <div className='adverts-step'>
    <div className='adverts-step_top'>
      <div className='adverts-congrats'>
        <img src={Congrats} alt='congrats gif' />
        <p>Congrats!</p>
        <span>Your ads has been launched</span>
      </div>
    </div>
    <div className='adverts-buttons'>
      <ButtonKit
        onClick={() => {
          setStep('launch');
          setOpened(false);
        }}
        className='adverts-continue'
        variant='contained'
        style={{ width: '100%' }}
      >
        Done <Arrow />
      </ButtonKit>
    </div>
  </div>
);

export default CongratStep;
