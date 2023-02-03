import axios from 'axios';
import { useUserAuth } from 'contexts';
import { handleResponse } from '../api/baseApi';
import config from '../setup/config';

const { apiUrl } = config;

const useCost = (vendorsObj) => {
  const { user } = useUserAuth();

  const requestVendorsDefaultParam = {
    master_email: user.email,
    access_token: user.accessToken,
  };

  const defaulltBody = { vendors: vendorsObj, ...requestVendorsDefaultParam };

  const load = () => axios.post(`${apiUrl}/user/loadv2`, { ...defaulltBody }).then(handleResponse);

  const save = ({ cost, vendors }) =>
    axios.post(`${apiUrl}/user/savev2`, { ...defaulltBody, vendors, data: { cost } });

  return {
    load,
    save,
  };
};

export default useCost;
