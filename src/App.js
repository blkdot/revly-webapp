import { Route, Routes } from 'react-router-dom';
import SignIn from './pages/signIn/SignIn';
import SignUp from './pages/signUp/SignUp';
import Dashboard from './pages/account/Account'; //TO-DO change path
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
    </div>
  );
}

export default App;
