export const ignoredFields = ['offer_id', 'master_id', 'vendor_id', 'ad_id', 'data', 'menu_items'];

export const headCells = [
  {
    id: 'vendor_name',
    numeric: false,
    disablePadding: true,
    label: 'Vendor Name',
  },
  {
    id: 'platform',
    numeric: true,
    disablePadding: false,
    label: 'Platform',
  },
  {
    id: 'discount_type',
    numeric: true,
    disablePadding: false,
    label: 'Discount Type',
  },
  {
    id: 'discount_rate',
    numeric: true,
    disablePadding: false,
    label: 'Discount Rate',
  },
  {
    id: 'target',
    numeric: true,
    disablePadding: false,
    label: 'Target',
  },
  {
    id: 'status',
    numeric: true,
    disablePadding: false,
    label: 'Status',
  },
];
