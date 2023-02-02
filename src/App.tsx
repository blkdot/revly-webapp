import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { QueryClientProvider, QueryClient } from 'react-query';

import './App.scss';

import { AuthContextProvider } from './contexts/AuthContext';
import { PlatformProvider } from './contexts/PlatformContext';
import { GlobalFunctionalitiesContextProvider } from './contexts/GlobalFunctionalitiesContext';

import SignIn from './pages/signIn/SignIn';
import SignUp from './pages/signUp/SignUp';
import Dashboard from './pages/dashboard/Dashboard';
import OnBoarding from './pages/onBoarding/OnBoarding';
import Settings from './pages/settings/Settings';
import ForgotPassword from './pages/forgotPassword/ForgotPassword';
import ProtectedRoutes from './routes/ProtectedRoutes';
import ProtectedOnboardRoutes from './routes/ProtectedOnboardRoutes';
import Check from './pages/check/Check';
import Planning from './pages/planning/Planning';
import MarketingAds from './pages/marketing/MarketingAds';
import MarketingOffer from './pages/marketing/MarketingOffer';
import AuthLayout from './components/layout/authLayout/AuthLayout';
import VerifyCode from './pages/verifyCode/VerifyCode';
import ResetPassword from './pages/resetPassword/ResetPassword';
import CompetitionListing from './pages/competition/CompetitionListing';
import CompetitionAlerts from './pages/competition/CompetitionAlerts';
import General from './pages/settings/general/General';
import Billing from './pages/settings/billing/Billing';
import NewSettingsOnboarding from './pages/settings/onboarding/NewSettingsOnboarding';
import ChangePassword from './pages/settings/changePassword/ChangePassword';
import Menu from './pages/settings/menu/Menu';
import Cost from './pages/settings/cost/Cost';
import ProtectedSettingsRoutes from './routes/ProtectedSettingsRoutes';

const theme = createTheme({
  palette: {
    primary: {
      main: '#906BFF',
      // second: '#3AC3B1 ',
      // warning: '#FFC107',
    },
    grey: {
      500: '#919eab3d',
    },
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <div className='App'>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider theme={theme}>
          <PlatformProvider>
            <AuthContextProvider>
              <GlobalFunctionalitiesContextProvider>
                <Routes>
                  <Route element={<AuthLayout />}>
                    <Route path='/' element={<SignIn />} />
                    <Route path='/signup' element={<SignUp />} />
                    <Route path='/verify-code-signup' element={<VerifyCode />} />
                    <Route path='/reset-password' element={<ResetPassword />} />
                  </Route>
                  <Route path='/forgot-password' element={<ForgotPassword />} />
                  <Route element={<ProtectedRoutes />}>
                    <Route element={<ProtectedOnboardRoutes />}>
                      <Route path='/dashboard' element={<Dashboard />} />
                      <Route path='/planning' element={<Planning />} />
                      <Route path='/competition/listing' element={<CompetitionListing />} />
                      <Route path='/competition/alerts' element={<CompetitionAlerts />} />
                      <Route path='/marketing/offer' element={<MarketingOffer />} />
                      <Route path='/marketing/ads' element={<MarketingAds />} />
                      <Route path='/verify-code' element={<VerifyCode />} />
                    </Route>
                    <Route path='/onboarding' element={<OnBoarding />} />
                    <Route path='/check' element={<Check />} />
                  </Route>
                  <Route element={<ProtectedSettingsRoutes />}>
                    <Route element={<ProtectedOnboardRoutes />}>
                      <Route path='/settings' element={<Settings />} />
                      <Route path='/settings/general' element={<General />} />
                      <Route path='/settings/billing' element={<Billing />} />
                      <Route path='/settings/onboarding' element={<NewSettingsOnboarding />} />
                      <Route path='/settings/change-password' element={<ChangePassword />} />
                      <Route path='/settings/menu' element={<Menu />} />
                      <Route path='/settings/cost' element={<Cost />} />
                    </Route>
                  </Route>
                </Routes>
              </GlobalFunctionalitiesContextProvider>
            </AuthContextProvider>
          </PlatformProvider>
        </ThemeProvider>
      </LocalizationProvider>
    </div>
  </QueryClientProvider>
);

export default App;
