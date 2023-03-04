import imageDeliverooFaviconWhite from '../assets/images/deliveroo-favicon-white.png';
import imageDeliverooFavicon from '../assets/images/deliveroo-favicon.webp';
import imageDeliveroo from '../assets/images/deliveroo.png';
import imageTalabatFavicon from '../assets/images/talabat-favicon.png';
import imageTalabat from '../assets/images/talabat.png';

export const platformList = [
  {
    srcFavicon: imageDeliverooFavicon,
    srcFaviconWhite: imageDeliverooFaviconWhite,
    src: imageDeliveroo,
    name: 'deliveroo',
    color: '#35B8B2',
  },
  {
    srcFavicon: imageTalabatFavicon,
    srcFaviconWhite: imageTalabatFavicon,
    src: imageTalabat,
    name: 'talabat',
    color: '#FF5A00',
  },
];

export type TPlatformObject = {
  [x: string]: {
    srcFavicon: string;
    srcFaviconWhite: string;
    src: string;
    name: string;
    color: string;
  };
};

export const platformObject: TPlatformObject = platformList.reduce(
  (acc, cur) => ({ ...acc, [cur.name]: cur }),
  {}
);

export type TPlatformUserData = {
  onboarded: boolean;
  platforms: {
    [x: string]: {
      registered: boolean;
      active: boolean;
      access_token: string | null;
      access_token_bis: string | null;
      vendor_ids: string[];
      email: string;
    }[];
  };
};

export const platformContextDefaultFormat: TPlatformUserData = {
  onboarded: false,
  platforms: platformList.reduce(
    (acc, { name }) => ({
      ...acc,
      [name]: [
        {
          registered: false,
          active: false,
          access_token: null,
          access_token_bis: null,
          vendor_ids: [],
        },
      ],
    }),
    {}
  ),
};
