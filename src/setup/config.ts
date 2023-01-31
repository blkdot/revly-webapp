const config = {
  apiUrl: 'https://revly-monolith-backend.herokuapp.com',
  firebaseApiUrl: 'https://us-central1-test-909d1.cloudfunctions.net',
  timeRefreshToken: 900_000, // 15min
  frontUrl: 'https://webapp-git-master-revly.vercel.app/',
  environment: process.env.REACT_APP_ENV || 'production',
};

export default config;
