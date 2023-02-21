import { Arrow } from 'assets/icons';
import { useAtom } from 'jotai';
import { ButtonKit } from 'kits';
import { FC } from 'react'
import { vendorsAtom } from 'store/vendorsAtom';
import CalendarCheckGrayIcon from '../../../../assets/images/ic_calendar-check-gray.svg';

const RecurencyStep: FC<{
  setStep: any;
  state: any;
  setState: any;
  setOpened: any;
  step: string;
}> = ({ setStep, state, setState, setOpened, step }) => {
  const [vendors,] = useAtom(vendorsAtom);
  return (
    <div className={`adverts-step ${step || ''}`}>
      <div className='top'>
        <p>2. Setup your Advert schedule and recurency</p>
        <span>
          Stand out from the crowd with an advert, Advertise on your platforms and you&apos;ll appear in the Featured section of the app
        </span>
        <div className='adver-schedule'>
         <div>
            <img src={CalendarCheckGrayIcon} alt='CalendarCheckIcon' />
            <p>Your Advert Schedule </p>
         </div>
        </div>
      </div>
      <div className='buttons'>
        <ButtonKit onClick={() => setOpened(false)} className='cancel' variant='contained'>
          Cancel
        </ButtonKit>
        <ButtonKit className='continue' variant='contained'>
          Continue <Arrow />
        </ButtonKit>
      </div>
    </div>
  )
}

export default RecurencyStep