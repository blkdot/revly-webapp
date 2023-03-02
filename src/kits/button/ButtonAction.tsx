import ButtonKit from './ButtonKit';

import './button.scss';

type TButtonAction = {
  onClick: () => void;
  children: string;
};

const ButtonAction: React.FC<TButtonAction> = ({ onClick, children }) => (
  <ButtonKit onClick={onClick} variant='contained' className='button-action-kit' disableElevation>
    {children}
    <svg width='9' height='14' viewBox='0 0 9 14' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M1 1L7.73426 6.77222C7.87394 6.89195 7.87394 7.10805 7.73426 7.22778L1 13'
        stroke='white'
        strokeWidth='2'
        strokeLinecap='round'
      />
    </svg>
  </ButtonKit>
);

export default ButtonAction;
