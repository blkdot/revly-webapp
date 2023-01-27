import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Route, Routes } from 'react-router-dom';

import './App.scss';

import { AuthContextProvider } from './contexts/AuthContext';
import { GlobalFunctionalitiesContextProvider } from './contexts/GlobalFunctionalitiesContext';
import { PlatformProvider } from './contexts/PlatformContext';

import AuthLayout from './components/layout/authLayout/AuthLayout';
import Check from './pages/check/Check';
import CompetitionAlerts from './pages/competition/CompetitionAlerts';
import CompetitionListing from './pages/competition/CompetitionListing';
import Dashboard from './pages/dashboard/Dashboard';
import ForgotPassword from './pages/forgotPassword/ForgotPassword';
import MarketingAds from './pages/marketing/MarketingAds';
import MarketingOffer from './pages/marketing/MarketingOffer';
import OnBoarding from './pages/onBoarding/OnBoarding';
import Planning from './pages/planning/Planning';
import ResetPassword from './pages/resetPassword/ResetPassword';
import Settings from './pages/settings/Settings';
import SignIn from './pages/signIn/SignIn';
import SignUp from './pages/signUp/SignUp';
import VerifyCode from './pages/verifyCode/VerifyCode';
import ProtectedOnboardRoutes from './routes/ProtectedOnboardRoutes';
import ProtectedRoutes from './routes/ProtectedRoutes';

const theme = createTheme({
  palette: {
    primary: {
      main: '#906BFF',
      // TODO: FIX IT
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
                      <Route path='/settings' element={<Settings />} />
                      <Route path='/marketing/offer' element={<MarketingOffer />} />
                      <Route path='/marketing/ads' element={<MarketingAds />} />
                      <Route path='/verify-code' element={<VerifyCode />} />
                    </Route>
                    <Route path='/onboarding' element={<OnBoarding />} />
                    <Route path='/check' element={<Check />} />
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
