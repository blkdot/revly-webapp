export const fomatOffers = (os) =>
  os.map((o) => ({
    date: o.start_date,
    branche: o.vendor_name,
    platform: o.platform,
    discountType: o.discount_type,
    procent: o.discount_rate,
    minOrder: o.minimum_order_value,
    target: o.target,
    status: o.status,
    'data.n_orders': o.data?.n_orders || '-',
    avgBasket: o.data?.average_basket || '-',
    roi: o.data?.roi || '-',
    revenue: o.data?.revenue || '-',
    id: o.offer_id,
  }));

export const defaultFilterStateFormat = {
  platform: [],
  discount_type: [],
  discount_rate: [],
  status: [],
  target: [],
};
