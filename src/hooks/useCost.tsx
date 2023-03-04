import { api, handleResponse } from 'api/utils';
import { useUser } from 'contexts';

const useCost = (vendorsObj) => {
  const user = useUser();

  const requestVendorsDefaultParam = {
    master_email: user.email,
    access_token: user.token,
  };

  const defaulltBody = { vendors: vendorsObj, ...requestVendorsDefaultParam };

  const load = () => api.post(`/user/loadv2`, { ...defaulltBody }).then(handleResponse);

  const save = ({ cost, vendors }) =>
    api.post(`/user/savev2`, { ...defaulltBody, vendors, data: { cost } });

  return {
    load,
    save,
  };
};

export default useCost;
