import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ThemeProvider, createTheme } from '@mui/material/styles';

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
import CompetitionRanking from './pages/competition/CompetitionRanking';
import CompetitionAlerts from './pages/competition/CompetitionAlerts';

const theme = createTheme({
  palette: {
    primary: {
      main: '#906BFF',
      second: '#3AC3B1 ',
      warning: '#FFC107',
    },
    grey: {
      500: '#919eab3d',
    },
  },
});

const App = () => (
  <div className="App">
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider theme={theme}>
        <GlobalFunctionalitiesContextProvider>
          <PlatformProvider>
            <AuthContextProvider>
              <Routes>
                <Route element={<AuthLayout />}>
                  <Route path="/" element={<SignIn />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                </Route>
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route element={<ProtectedRoutes />}>
                  <Route element={<ProtectedOnboardRoutes />}>
                    {/* <Route path='/account' element={<Account />} /> */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/planning" element={<Planning />} />
                    <Route path="/competition/ranking" element={<CompetitionRanking />} />
                    <Route path="/competition/alerts" element={<CompetitionAlerts />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/marketing/offer" element={<MarketingOffer />} />
                    <Route path="/marketing/ads" element={<MarketingAds />} />
                    <Route path="/verify-code" element={<VerifyCode />} />
                  </Route>
                  <Route path="/onboarding" element={<OnBoarding />} />
                  <Route path="/check" element={<Check />} />
                </Route>
              </Routes>
            </AuthContextProvider>
          </PlatformProvider>
        </GlobalFunctionalitiesContextProvider>
      </ThemeProvider>
    </LocalizationProvider>
  </div>
);

export default App;
