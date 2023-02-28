import { Arrow } from 'assets/icons';
import { ButtonKit } from 'kits';
import { FC } from 'react';
import Congrats from '../../../assets/images/congrats.gif';

const CongratStep: FC<{
  step: string;
  setStep: (value: string) => void;
  setOpened: (value: boolean) => void;
}> = ({ step, setOpened, setStep }) => (
  <div className={`adverts-step ${step || ''}`}>
    <div className='top'>
      <div className='adverts-congrats'>
        <img src={Congrats} alt='congrats gif' />
        <p>Congrats!</p>
        <span>Your ads has been launched</span>
      </div>
    </div>
    <div className='buttons'>
      <ButtonKit
        onClick={() => {
          setStep('launch');
          setOpened(false);
        }}
        className='continue'
        variant='contained'
        style={{ width: '100%' }}
      >
        Done <Arrow />
      </ButtonKit>
    </div>
  </div>
);

export default CongratStep;
