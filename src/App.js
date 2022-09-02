import { Route, Routes } from 'react-router-dom';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import SignIn from './pages/signIn/SignIn';
import SignUp from './pages/signUp/SignUp';
import Dashboard from './pages/dashboard/Dashboard';
import OnBoarding from './pages/onBoarding/OnBoarding';
import Settings from './pages/settings/Settings';
import { AuthContextProvider } from './contexts/AuthContext';
import { PlatformProvider } from './contexts/PlatformContext';
import { ProtectedRoutes } from './routes/ProtectedRoutes';
import { ProtectedOnboardRoutes } from './routes/ProtectedOnboardRoutes';
import './App.scss';

function App() {
  return (
    <div className="App">
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AuthContextProvider>
          <PlatformProvider>
            <Routes>
              <Route path='/' element={<SignIn />} />
              <Route path='/signup' element={<SignUp />} />
              <Route element={<ProtectedRoutes />}>
                <Route element={<ProtectedOnboardRoutes />}>
                  {/*<Route path='/account' element={<Account />} />*/}
                  <Route path='/dashboard' element={<Dashboard />} />
                  <Route path='/settings' element={<Settings />} />
                </Route>
                <Route path='/onboarding' element={<OnBoarding />} />
              </Route>
            </Routes>
          </PlatformProvider>
        </AuthContextProvider>
      </LocalizationProvider>
    </div>
  );
}

export default App;
