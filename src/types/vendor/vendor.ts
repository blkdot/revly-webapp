export type TVendorsObj = {
  [x: string]: {
    chain_id: number;
    vendor_id: string | number;
    data: {
      chain_name: string;
      vendor_name: string;
    };
    metadata: {
      drn_id?: string;
      prefix_vendor_id?: string;
      is_active: boolean;
      is_deleted: boolean;
      org_id?: string;
    };
  }[];
};

export type TDisplayVendor =
  | {
      [x: string]: {
        is_matched: boolean;
        platforms: {
          [x: string]: {
            chain_id: number;
            vendor_id: string | number;
            data: {
              chain_name: string;
              vendor_name: string;
            };
            metadata: {
              drn_id?: string;
              prefix_vendor_id?: string;
              is_active: boolean;
              is_deleted: boolean;
              org_id?: string;
            };
          };
        };
      };
    }
  | Record<string, never>;

export type TResponseVendorsApi = TVendorsObj & {
  display: TDisplayVendor;
};

export type TVendorsArr = {
  chain_id: number;
  vendor_id: string | number;
  data: {
    chain_name: string;
    vendor_name: string;
  };
  metadata: {
    drn_id?: string;
    prefix_vendor_id?: string;
    is_active: boolean;
    is_deleted: boolean;
    ord_id?: string;
  };
  platform: string;
  email: string;
  access_token: string;
  access_token_bis: string;
};

export type TChainData = {
  chain_id: number;
  chain_name: string;
  vendor_id: string | number;
  vendor_name: string;
  is_active: boolean;
  access_token: string;
  access_token_bis: string;
  platform: string;
  data: {
    chain_id: number;
    vendor_id: string | number;
    data: {
      chain_name: string;
      vendor_name: string;
    };
    metadata: {
      drn_id?: string;
      prefix_vendor_id?: string;
      is_active: boolean;
      is_deleted: boolean;
      org_id?: string;
      cost?: string | number;
    };
  };
};

export type TVendors = {
  vendorsSelected: TVendorsArr[];
  vendorsObj: TVendorsObj;
  vendorsArr: TVendorsArr[];
  display: TDisplayVendor;
  chainObj: TDisplayVendor;
  chainData: TChainData[];
};

export const prepareVendors = (vendors: TVendorsObj) => {
  const out = {};

  Object.keys(vendors).forEach((p) => {
    out[p] = vendors[p].filter((v) => v.metadata.is_active);
  });

  Object.keys(out).forEach((p) => {
    if (out[p].length === 0 || p === 'display') {
      delete out[p];
    }
  });

  return out;
};
