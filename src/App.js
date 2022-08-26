import { Route, Routes } from 'react-router-dom';
import SignIn from './components/SignIn/SignIn';
import SignUp from './components/SignUp/SignUp';
import Account from './components/Account/Account';
import { AuthContextProvider } from './contexts/AuthContext';
import { ProtectedRoutes } from './routes/ProtectedRoutes';
import './App.css';

function App() {
  return (
    <div className="App">
        <AuthContextProvider>
          <Routes>
            <Route path='/' element={<SignIn />} />
            <Route path='/signup' element={<SignUp />} />
            <Route element={<ProtectedRoutes />}>
              <Route path='/account' element={<Account />} />
            </Route>
          </Routes>
        </AuthContextProvider>
    </div>
  );
}

export default App;
