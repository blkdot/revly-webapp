import imageDeliveroo from '../assets/images/deliveroo.png';
import imageTalabat from '../assets/images/talabat.png';

export const platformList = [
  { src: imageDeliveroo, name: 'deliveroo', color: '#38BCB4' },
  { src: imageTalabat, name: 'talabat', color: '#EF6400' },
];

export const platformContexDefaultFormat = {
  onboarded: false,
  platforms: platformList.reduce(
    (acc, { name }) => ({
      ...acc,
      [name]: {
        registered: false,
        active: false,
        access_token: null,
        access_token_bis: null,
      },
    }),
    {},
  ),
};
