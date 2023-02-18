import {
  Adverts,
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
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {
  AuthLayout,
  MainLayout,
  ProtectedOnboardRoutes,
  ProtectedRoutes,
  SettingsLayout,
} from 'routes';

export const App = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path='/' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/verify-code-signup' element={<VerifyCode />} />
        <Route path='/reset-password' element={<ResetPassword />} />
      </Route>
      <Route path='/forgot-password' element={<ForgotPassword />} />
      <Route element={<ProtectedRoutes />}>
        <Route path='/check' element={<Check />} />
        <Route path='/verify-code' element={<VerifyCode />} />
        <Route path='/dashboardOnboard' element={<DashboardOnboard />} />
        <Route element={<ProtectedOnboardRoutes />}>
          <Route element={<MainLayout />}>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/planning' element={<Planning />} />
            <Route path='/competition/listing' element={<CompetitionListing />} />
            <Route path='/competition/alerts' element={<CompetitionAlerts />} />
            <Route path='/marketing/offer' element={<MarketingOffer />} />
            <Route path='/marketing/ads' element={<MarketingAds />} />
            <Route path='/adverts' element={<Adverts />} />
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
  </BrowserRouter>
);
