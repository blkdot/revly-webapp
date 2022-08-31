import axios from 'axios';

import config from '../setup/config';

const useApi = () => {
  const { apiUrl } = config;
  const initLogin = async (body) => {
    const response = await axios.post(`${apiUrl}/login/master`, body);

    if (response.status !== 200) {
      console.log('Error');
      console.log(response);
      return { error: true, ...response };
    }

    // TODO: handle response from the API here
    // save delivery client token here
    console.log('SUCCESS');
    console.log(response);
  };

  return {
    initLogin,
  };
};

export default useApi;
