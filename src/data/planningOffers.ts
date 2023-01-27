export const ignoredFields = [
  'offer_id',
  'master_id',
  'vendor_id',
  'ad_id',
  'data',
  'menu_items',
  'attributed_order_value',
  'clicks_count',
  'conversion_rate',
  'ad_serving_count',
  'new_customers_count',
  'orders_count',
  'remaining_budget',
  'spend',
  'return_on_ad_spent',
];

export const headCellsOffre = [
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

export const headCellsAds = [
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
    id: 'start_date',
    numeric: true,
    disablePadding: false,
    label: 'Start Date',
  },
  {
    id: 'end_date',
    numeric: true,
    disablePadding: false,
    label: 'End Date',
  },
  {
    id: 'target',
    numeric: true,
    disablePadding: false,
    label: 'Target',
  },
  {
    id: 'cost_per_click',
    numeric: true,
    disablePadding: false,
    label: 'Bid',
  },
  {
    id: 'status',
    numeric: true,
    disablePadding: false,
    label: 'Status',
  },
];
