/* eslint-disable no-unused-vars */
import axios from 'axios';

import config from '../setup/config';
import { onBoardingResponse } from '../data/fakeData'; // TODO: remove this when we can use the API fully on dev mode or in production

const useApi = () => {
  const { apiUrl } = config;
  const initLogin = async (body) => {
    try {
      const response = await axios.post(`${apiUrl}/login/master`, body);

      if (response.status !== 200) {
        throw new Error(response.message);
      }

      return { success: true, response: onBoardingResponse }; // TODO: replace the simulation response
    } catch (error) {
      return error;
    }
  };

  const loginAll = async (body) => {
    try {
      const response = await axios.post(`${apiUrl}/login`, body);

      if (response.status !== 200) {
        throw new Error(response.message);
      }

      return { success: true, response: onBoardingResponse }; // TODO: replace the simulation response
    } catch (error) {
      return error;
    }
  };

  const loginPlatform = async (platform, body) => {
    try {
      const response = await axios.post(`${apiUrl}/login/${platform}`, body);

      if (response.status !== 200) {
        throw new Error(response.message);
      }

      return { success: true, response: onBoardingResponse[0] }; // TODO: replace the simulation response
    } catch (error) {
      return error;
    }
  };

  return {
    initLogin,
    loginAll,
    loginPlatform,
  };
};

export default useApi;
