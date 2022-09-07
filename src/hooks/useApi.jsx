import axios from 'axios';

import config from '../setup/config';
import useAlert from './useAlert';

// import { loginExistResponse } from '../data/fakeDataOnboarding';

const useApi = () => {
  const { apiUrl } = config;
  const { showAlert, setAlertMessage } = useAlert();

  const handleResponse = (res, alert = true) => {
    if (res.status !== 200) {
      handleError(new Error(res.detail || res.message), alert);
    }

    return res;
  };
  
  const handleError = (err, alert = true) => {
    const message = new Error(err.response.data.detail || err.message);

    if (alert) {
      setAlertMessage(message);
      showAlert();
    }

    return message;
  };

  const initLogin = (body) =>
    axios
      .post(`${apiUrl}/login/master`, body)
      .then((res) => handleResponse(res))
      .catch((err) => handleError(err));

  const loginAll = async (body) =>
    axios
      .post(`${apiUrl}/login`, body)
      .then((res) => handleResponse(res))
      .catch((err) => handleError(err));

  const loginExist = async (body) =>
    axios
      .post(`${apiUrl}/login/exist`, body)
      .then((res) => handleResponse(res, false))
      .catch((err) => handleError(err, false));

  const loginPlatform = async (platform, body) =>
    axios
      .post(`${apiUrl}/login/${platform}`, body)
      .then((res) => handleResponse(res))
      .catch((err) => handleError(err));

  return {
    initLogin,
    loginAll,
    loginPlatform,
    loginExist,
  };
};

export default useApi;
