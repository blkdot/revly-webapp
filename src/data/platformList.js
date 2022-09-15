import imageDeliveroo from '../assets/images/deliveroo.png';
import imageTalabat from '../assets/images/talabat.png';

export const platformList = [
  { src: imageDeliveroo, name: 'deliveroo' },
  { src: imageTalabat, name: 'talabat' },
];

export const platformContexDefaultFormat = {
  onboarded: false,
  platforms: platformList.reduce(
    (acc, { name }) => ({
      ...acc,
      [name]: {
        registered: false,
        active_status: false,
        access_token: null,
        access_token_bis: null,
      },
    }),
    {},
  ),
};
