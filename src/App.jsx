import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import './App.scss';

import SignIn from './pages/signIn/SignIn';
import SignUp from './pages/signUp/SignUp';
import Dashboard from './pages/dashboard/Dashboard';
import OnBoarding from './pages/onBoarding/OnBoarding';
import Settings from './pages/settings/Settings';
import ForgotPassword from './pages/forgotPassword/ForgotPassword';
import { AuthContextProvider } from './contexts/AuthContext';
import { PlatformProvider } from './contexts/PlatformContext';
import { GlobalFunctionalitiesContextProvider } from './contexts/GlobalFunctionalitiesContext';
import ProtectedRoutes from './routes/ProtectedRoutes';
import ProtectedOnboardRoutes from './routes/ProtectedOnboardRoutes';
import Competition from './pages/competition/Competition';
import PlanningAds from './pages/planning/PlanningAds';
import PlanningOffers from './pages/planning/PlanningOffers';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4d2681',
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
                <Route path="/" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route element={<ProtectedRoutes />}>
                  <Route element={<ProtectedOnboardRoutes />}>
                    {/* <Route path='/account' element={<Account />} /> */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/planning/ads" element={<PlanningAds />} />
                    <Route path="/planning/offers" element={<PlanningOffers />} />
                    <Route path="/competition" element={<Competition />} />
                    <Route path="/settings" element={<Settings />} />
                  </Route>
                  <Route path="/onboarding" element={<OnBoarding />} />
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
