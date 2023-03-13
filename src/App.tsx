import { auth } from 'firebase-config';
import { onAuthStateChanged, User } from 'firebase/auth';
import { SpinnerKit } from 'kits';
import {
  Adverts,
  Check,
  CompetitionAlerts,
  CompetitionListing,
  Dashboard,
  DashboardOnboard,
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
import { VendorsDropdown } from './v/VendorsDropdown';

const generate = () =>
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => ({
    value: i,
    title: 'Kulcha King - JLT Branch',
    subTitle: '10 Branches',
    checked: false,
    intermediate: false,
    disabled: i % 3 === 0,
    label: 'Kulcha King - JLT Branch',
    children: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((j) => ({
      value: i * 10 + j,
      title: `Kulcha King - JLT Branch (${i * 10 + j})`,
      subTitle: `${i * 10 + j}`,
      checked: false,
      disabled: j % 4 === 0,
      label: `Kulcha King - JLT Branch (${i * 10 + j})`,
    })),
  }));

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
      } else {
        navigate('/');
      }
    });
  }, []);

  const [values, setValues] = useState([11, 12]);

  console.log(values);

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
        <Route
          path='/test'
          element={
            <VendorsDropdown values={values} options={generate()} onChange={setValues as any} />
          }
        />
        <Route path='/verify-code' element={<VerifyCode />} />
        <Route element={<ProtectedOnboardRoutes />}>
          <Route element={<MainLayout />}>
          <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/planning' element={<Planning />} />
            <Route path='/competition/listing' element={<CompetitionListing />} />
            <Route path='/competition/alerts' element={<CompetitionAlerts />} />
            <Route path='/marketing/offer' element={<MarketingOffer />} />
            <Route path='/marketing/ads' element={<Adverts />} />
          </Route>
          <Route element={<SettingsLayout />}>
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
