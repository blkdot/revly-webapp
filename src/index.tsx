import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  AuthContextProvider,
  GlobalFunctionalitiesContextProvider,
  PlatformProvider,
} from 'contexts';
import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';
import ReactDOM from 'react-dom/client';
import Modal from 'react-modal';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.scss';

dayjs.extend(updateLocale);
dayjs.updateLocale('en', {
  weekStart: 1,
});

Modal.setAppElement('#root');

const theme = createTheme({
  palette: {
    primary: {
      main: '#906BFF',
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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider theme={theme}>
        <PlatformProvider>
          <AuthContextProvider>
            <GlobalFunctionalitiesContextProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </GlobalFunctionalitiesContextProvider>
          </AuthContextProvider>
        </PlatformProvider>
      </ThemeProvider>
    </LocalizationProvider>
  </QueryClientProvider>
);
