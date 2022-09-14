const config = {
  apiUrl: 'https://revly-monolith-backend.herokuapp.com',
  timeRefreshToken: 900_000, // 15min
  frontUrl: 'http://localhost:3000',
  environment: process.env.REACT_APP_ENV || 'production',
};

export default config;
