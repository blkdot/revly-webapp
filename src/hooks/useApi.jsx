/* eslint-disable no-unused-vars */
import axios from 'axios';

import config from '../setup/config';
import { onBoardingResponse, loginExistResponse } from '../data/fakeDataOnboarding'; // TODO: remove this when we can use the API fully on dev mode or in production
import useAlert from './useAlert';

const useApi = () => {
  const { apiUrl } = config;
  const { showAlert, setAlertMessage } = useAlert();
  const initLogin = async (body) => {
    try {
      const response = await axios.post(`${apiUrl}/login/master`, body);

      if (response.status !== 200) {
        throw new Error(response.message);
      }

      return { success: true, response: onBoardingResponse }; // TODO: replace the simulation response
    } catch (error) {
      setAlertMessage(error.message);
      showAlert();
      return error;
    }
  };

  const loginAll = async (body) => {
    try {
      const response = await axios.post(`${apiUrl}/login`, body);

      // TODO: uncomment if you want to use on real response
      // if (response.status !== 200) {
      //   throw new Error(response.message);
      // }

      return { success: true, response: onBoardingResponse }; // TODO: replace the simulation response
    } catch (error) {
      // TODO: uncomment if want to use on real response
      // return error;
      setAlertMessage(error.message);
      showAlert();

      // TODO: Remove if want to test with fake response
      return { success: true, response: onBoardingResponse }; 
    }
  };

  const loginExist = async (body) => {
    try {
      const response = await axios.post(`${apiUrl}/login/exist`, body);

      // TODO: uncomment if you want to use on real response
      // if (response.status !== 200) {
      //   throw new Error(response.message);
      // }

      return { success: true, response: loginExistResponse }; // TODO: replace the simulation response
    } catch (error) {
      // TODO: uncomment if want to use on real response
      // return error;

      // TODO: Remove if want to test with fake response
      return { success: true, response: loginExistResponse }; 
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
      setAlertMessage(error.message);
      showAlert();
      return error;
    }
  };

  return {
    initLogin,
    loginAll,
    loginPlatform,
    loginExist
  };
};

export default useApi;
