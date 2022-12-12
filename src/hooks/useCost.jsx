import axios from 'axios';
import { handleResponse } from '../api/baseApi';

import config from '../setup/config';
import { useUserAuth } from '../contexts/AuthContext';

const { apiUrl } = config;

const useCost = (vendorsObj) => {
  const { user } = useUserAuth();

  const requestVendorsDefaultParam = {
    master_email: user.email,
    access_token: user.accessToken,
  };

  const defaulltBody = { vendors: vendorsObj, ...requestVendorsDefaultParam };

  const load = () => axios.post(`${apiUrl}/user/load`, { ...defaulltBody }).then(handleResponse);

  const save = ({ cost, vendors }) =>
    axios.post(`${apiUrl}/user/save`, { ...defaulltBody, vendors, data: { cost } });

  return {
    load,
    save,
  };
};

export default useCost;
