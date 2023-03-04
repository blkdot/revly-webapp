import { usePlatform, useUser } from 'contexts';
import { useApi } from 'hooks';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Check = () => {
  const { settingsOnboarded } = useApi();
  const navigate = useNavigate();
  const { setUserPlatformData, userPlatformData } = usePlatform();
  const user = useUser();

  const getPlatformData = async () => {
    if (!user) return navigate('/');

    try {
      const res = await settingsOnboarded({
        master_email: user.email,
        access_token: user.token,
      });

      if (res instanceof Error || !res.onboarded) return navigate('/onboarding');

      setUserPlatformData({
        onboarded: true,
        platforms: { ...userPlatformData.platforms, ...res.platforms },
      });

      return navigate('/dashboard');
    } catch (error) {
      return navigate('/onboarding');
    }
  };

  useEffect(() => {
    getPlatformData();
  }, []);

  return <div />;
};

export default Check;
