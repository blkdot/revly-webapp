export const usePlatform = () => ({
  getActivePlatform: () => 'deliveroo',
  userPlatformData: {
    onboarded: true,
    platforms: {
      deliveroo: [
        {
          access_token: '',
          access_token_bis: null,
          active: true,
          registered: true,
          email: 'revly@test.com',
          vendor_ids: ['126601'],
        },
      ],
      talabat: [
        {
          access_token: '',
          access_token_bis: '',
          active: true,
          registered: true,
          email: 'revly@test.com',
          vendor_ids: ['29032'],
        },
      ],
    },
  },
  setUserPlatformData: jest.fn(),
  cleanPlatformData: jest.fn(),
});

export default usePlatform;
