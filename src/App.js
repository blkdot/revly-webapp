import { Route, Routes } from 'react-router-dom';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import './App.scss';

import SignIn from './pages/signIn/SignIn';
import SignUp from './pages/signUp/SignUp';
import Dashboard from './pages/dashboard/Dashboard';
import OnBoarding from './pages/onBoarding/OnBoarding';
import Settings from './pages/settings/Settings';
import SettingAccount from './pages/settings/account/SettingAccount';
import ForgotPassword from './pages/forgotPassword/ForgotPassword';
import ResetPassword from './pages/resetPassword/ResetPassword';
import { AuthContextProvider } from './contexts/AuthContext';
import { PlatformProvider } from './contexts/PlatformContext';
import { GlobalFunctionalitiesContextProvider } from './contexts/GlobalFunctionalitiesContext';
import { ProtectedRoutes } from './routes/ProtectedRoutes';
import { ProtectedOnboardRoutes } from './routes/ProtectedOnboardRoutes';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4d2681',
    },
  }
});

function App() {
  return (
    <div className="App">
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider theme={theme}>
          <GlobalFunctionalitiesContextProvider>
            <AuthContextProvider>
              <PlatformProvider>
                <Routes>
                  <Route path='/' element={<SignIn />} />
                  <Route path='/signup' element={<SignUp />} />
                  <Route path='/forgot-password' element={<ForgotPassword />} />
                  {/* TODO: add a protected route for the reset password */}
                  <Route path='/reset-password' element={<ResetPassword />} />
                  <Route element={<ProtectedRoutes />}>
                    <Route element={<ProtectedOnboardRoutes />}>
                      {/*<Route path='/account' element={<Account />} />*/}
                      <Route path='/dashboard' element={<Dashboard />} />
                      <Route path='/settings' element={<Settings />} />
                      <Route path='/settings/account' element={<SettingAccount />} />
                    </Route>
                    <Route path='/onboarding' element={<OnBoarding />} />
                  </Route>
                </Routes>
              </PlatformProvider>
            </AuthContextProvider>
          </GlobalFunctionalitiesContextProvider>
        </ThemeProvider>
      </LocalizationProvider>
    </div>
  );
}

export default App;
