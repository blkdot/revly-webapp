import { auth } from 'firebase-config';
import { onAuthStateChanged, User } from 'firebase/auth';
import { SpinnerKit } from 'kits';
import {
  Adverts,
  Check,
  CompetitionAlerts,
  CompetitionListing,
  Dashboard,
  ForgotPassword,
  MarketingOffer,
  Planning,
  ResetPassword,
  SettingsChangePassword,
  SettingsCost,
  SettingsGeneral,
  SettingsMenu,
  SettingsOnboarding,
  SignIn,
  SignUp,
  VerifyCode,
} from 'pages';
import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import {
  AuthLayout,
  MainLayout,
  ProtectedOnboardRoutes,
  ProtectedRoutes,
  SettingsLayout,
} from 'routes';

const App = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    setLoading(true);

    return onAuthStateChanged(auth, (u) => {
      setLoading(false);

      if (u) {
        setUser(u);
        if (pathname === '/') {
          navigate('/dashboard');
        }
      }
    });
  }, []);

  if (loading) {
    return (
      <div className='main-loading'>
        <SpinnerKit style={{ display: 'flex', margin: 'auto' }} />
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path='/' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/verify-code-signup' element={<VerifyCode />} />
        <Route path='/reset-password' element={<ResetPassword />} />
      </Route>
      <Route path='/forgot-password' element={<ForgotPassword />} />
      <Route element={<ProtectedRoutes user={user} />}>
        <Route path='/check' element={<Check />} />
        <Route path='/verify-code' element={<VerifyCode />} />
        <Route element={<ProtectedOnboardRoutes />}>
          <Route element={<MainLayout />}>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/planning' element={<Planning />} />
            <Route path='/listing' element={<CompetitionListing />} />
            <Route path='/alerts' element={<CompetitionAlerts />} />
            <Route path='/offer' element={<MarketingOffer />} />
            <Route path='/adverts' element={<Adverts />} />
            <Route path='/settings/general' element={<SettingsGeneral />} />
            <Route path='/settings/onboarding' element={<SettingsOnboarding />} />
            <Route path='/settings/menu' element={<SettingsMenu />} />
            <Route path='/settings/cost' element={<SettingsCost />} />
            <Route path='/settings/change-password' element={<SettingsChangePassword />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
