const config = {
  apiUrl: 'https://revly-backend-prod.herokuapp.com',
  firebaseApiUrl: 'https://us-central1-test-909d1.cloudfunctions.net',
  timeRefreshToken: 900_000, // 15min
  frontUrl: process.env.REACT_APP_FRONT_URL || 'https://app.revly.ae/',
  environment: process.env.REACT_APP_ENV || 'production',
};

export default config;
