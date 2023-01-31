import imageDeliveroo from '../assets/images/deliveroo.png';
import imageDeliverooFavicon from '../assets/images/deliveroo-favicon.webp';
import imageDeliverooFaviconWhite from '../assets/images/deliveroo-favicon-white.png';
import imageTalabat from '../assets/images/talabat.png';
import imageTalabatFavicon from '../assets/images/talabat-favicon.png';

export const platformList = [
  {
    srcFavicon: imageDeliverooFavicon,
    srcFaviconWhite: imageDeliverooFaviconWhite,
    src: imageDeliveroo,
    name: 'deliveroo',
    color: '#35B8B2',
  },
  { srcFavicon: imageTalabatFavicon, srcFaviconWhite: imageTalabatFavicon, src: imageTalabat, name: 'talabat', color: '#FF5A00' },
];

export const platformObject = platformList.reduce((acc, cur) => ({ ...acc, [cur.name]: cur }), {});

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
    {}
  ),
};
