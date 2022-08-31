import { Route, Routes } from 'react-router-dom';
import SignIn from './pages/signIn/SignIn';
import SignUp from './pages/signUp/SignUp';
import Account from './pages/account/Account';
import OnBoarding from './pages/onBoarding/OnBoarding';
import { AuthContextProvider } from './contexts/AuthContext';
import { AccessTokenProvider } from './contexts/AccessTokenContext';
import { ProtectedRoutes } from './routes/ProtectedRoutes';
import './App.scss';

function App() {
  return (
    <div className="App">
        <AuthContextProvider>
          <AccessTokenProvider>
            <Routes>
              <Route path='/' element={<SignIn />} />
              <Route path='/signup' element={<SignUp />} />
              <Route element={<ProtectedRoutes />}>
                <Route path='/account' element={<Account />} />
                <Route path='/onboarding' element={<OnBoarding />} />
              </Route>
            </Routes>
          </AccessTokenProvider>
        </AuthContextProvider>
    </div>
  );
}

export default App;
