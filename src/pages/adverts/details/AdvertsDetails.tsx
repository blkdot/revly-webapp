import { Arrow } from 'assets/icons';
import { PaperKit } from 'kits';
import { useState, FC } from 'react';

const AdvertsDetails: FC<{ data: any; setOpened: any }> = ({ data, setOpened }) => {
  const [count, setCount] = useState(0);
  return (
    <PaperKit className='competition-paper adverts'>
      <button onClick={() => setOpened(false)} type='button' className='back-icon'>
        <Arrow />
        <span style={{ paddingLeft: '5px' }}>Back</span>
      </button>
    </PaperKit>
  );
};

export default AdvertsDetails;
