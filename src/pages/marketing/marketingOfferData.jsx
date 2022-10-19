export const fomatOffers = (os) =>
  os.map((o) => ({
    date: o.start_date,
    branche: o.vendor_name,
    platform: o.platform,
    // day: 'Mocked',
    // slot: 'Mocked',
    discountType: o.discount_type,
    procent: o.discount_rate,
    minOrder: o.minimum_order_value,
    target: o.target,
    status: o.status,
    // discountTypePr: 'Mocked',
    // targetPr: 'Mocked',
    // statusPr: 'Mocked',
    // caroussel: 'Mocked',
    // rank: 'Mocked',
    orders: o.data?.n_orders || '-',
    avgBasket: o.data?.average_basket || '-',
    roi: o.data?.roi || '-',
    revenue: o.data?.revenue || '-',
    id: o.offer_id,
  }));

export const defaultFilterStateFormat = {
  platform: [],
  discountType: [],
  procent: [],
  status: [],
};
