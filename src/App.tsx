import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  AuthContextProvider,
  GlobalFunctionalitiesContextProvider,
  PlatformProvider,
} from 'contexts';
import {
  Check,
  CompetitionAlerts,
  CompetitionListing,
  Dashboard,
  DashboardOnboard,
  ForgotPassword,
  MarketingAds,
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
import { Route, Routes } from 'react-router-dom';
import { ProtectedOnboardRoutes, ProtectedRoutes, ProtectedSettingsRoutes } from 'routes';
import './App.scss';
import AuthLayout from './components/layout/authLayout/AuthLayout';

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
      retry: false,
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
                    <Route path='/dashboardOnboard' element={<DashboardOnboard />} />
                    <Route element={<ProtectedOnboardRoutes />}>
                      <Route path='/dashboard' element={<Dashboard />} />
                      <Route path='/planning' element={<Planning />} />
                      <Route path='/competition/listing' element={<CompetitionListing />} />
                      <Route path='/competition/alerts' element={<CompetitionAlerts />} />
                      <Route path='/marketing/offer' element={<MarketingOffer />} />
                      <Route path='/marketing/ads' element={<MarketingAds />} />
                      <Route path='/verify-code' element={<VerifyCode />} />
                    </Route>
                    <Route path='/check' element={<Check />} />
                  </Route>
                  <Route element={<ProtectedSettingsRoutes />}>
                    <Route element={<ProtectedOnboardRoutes />}>
                      <Route path='/settings/general' element={<SettingsGeneral />} />
                      <Route path='/settings/onboarding' element={<SettingsOnboarding />} />
                      <Route path='/settings/menu' element={<SettingsMenu />} />
                      <Route path='/settings/cost' element={<SettingsCost />} />
                      <Route
                        path='/settings/change-password'
                        element={<SettingsChangePassword />}
                      />
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