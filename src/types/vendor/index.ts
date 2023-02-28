export type VendorsV2 = {
  deliveroo: unknown;
  talabat: unknown;
  display: Display;
};

export type Display = {
  [key: string]: DisplayVendor;
};

export type DisplayVendor = {
  platforms: {
    talabat?: Talabat;
    deliveroo?: Deliveroo;
  };
  is_matched: boolean;
};

export type Deliveroo = {
  vendor_id: string;
  chain_id: number;
  data: {
    vendor_name: string;
    chain_name: string;
  };
  metadata: {
    cost: string;
    drn_id: string;
    org_id: string;
    is_active: boolean;
    is_deleted: boolean;
  };
};

export type Talabat = {
  vendor_id: string;
  chain_id: number;
  data: {
    vendor_name: string;
    chain_name: string;
  };
  metadata: {
    is_active: boolean;
    is_deleted: boolean;
    prefix_vendor_id: string;
  };
};
