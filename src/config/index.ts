type Config = {
  readonly apiUrl: string;
  readonly firebaseApiUrl: string;
  readonly timeRefreshToken: number;
  readonly frontUrl: string;
  readonly environment: string;
};

export const config: Config = {
  apiUrl: process.env.REACT_APP_API_URL || 'https://revly-backend-develop.herokuapp.com',
  firebaseApiUrl: 'https://us-central1-test-909d1.cloudfunctions.net',
  timeRefreshToken: 900_000, // 15min
  frontUrl: process.env.REACT_APP_FRONT_URL || 'https://app.revly.ae/',
  environment: process.env.REACT_APP_ENV || 'production',
};
