import imageDeliverooFaviconWhite from '../assets/images/deliveroo-favicon-white.png';
import imageDeliverooFavicon from '../assets/images/deliveroo-favicon.webp';
import imageTalabatFavicon from '../assets/images/talabat-favicon.png';

import imageCareem from '../assets/images/careem.svg';
import imageNoon from '../assets/images/noon.svg';

import imageDeliverooNoBg from '../assets/images/deliveroo-no-bg.svg';
import imageTalabatNoBg from '../assets/images/talabat-no-bg.svg';
import imageCareemNoBg from '../assets/images/careem-no-bg.svg';

export const platformList = [
  {
    srcNoBg: imageDeliverooNoBg,
    src: imageDeliverooFavicon,
    srcWhite: imageDeliverooFaviconWhite,
    name: 'deliveroo',
    color: '#35B8B2',
    disabled: false,
  },
  {
    srcNoBg: imageTalabatNoBg,
    src: imageTalabatFavicon,
    name: 'talabat',
    color: '#FF5A00',
    disabled: false,
  },
  {
    srcNoBg: imageCareemNoBg,
    src: imageCareem,
    name: 'careem',
    color: '#3BB44E',
    disabled: false,
  },
  {
    srcNoBg: imageNoon,
    src: imageNoon,
    name: 'noon',
    color: '#F2DF0C',
    disabled: false,
  },
];

export type TPlatformObject = {
  [x: string]: {
    srcNoBg: string;
    srcWhite?: string;
    src: string;
    name: string;
    color: string;
    disabled?: boolean;
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
