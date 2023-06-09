import { usePlatform } from 'contexts';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Congrats.scss';

const Congrats = () => {
  const navigate = useNavigate();
  const { userPlatformData, setUserPlatformData } = usePlatform();

  useEffect(() => {
    setTimeout(() => {
      // TODO: may be remove this when not in dev mode
      setUserPlatformData({ ...userPlatformData, onboarded: true });
      navigate('/dashboard');
    }, 5000);
  });

  return (
    <div className='congrats'>
      <span>Congratulation !</span>
    </div>
  );
};

export default Congrats;
