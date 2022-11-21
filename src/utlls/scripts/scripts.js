export const descendingComparator = (a, b, orderBy) => {
  let next = b[orderBy];
  let prev = a[orderBy];

  const sp = prev.split(' at ');
  const sn = next.split(' at ');

  if (sp.length > 1 && sn.length > 1) {
    prev = sp.join('').replace('/', '').replace(':', '');
    next = sn.join('').replace('/', '').replace(':', '');
  }

  if (next < prev) {
    return -1;
  }
  if (next > prev) {
    return 1;
  }
  return 0;
};

export const getComparator = (order, orderBy) =>
  order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
export const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el.data, index, el]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);

    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[2]);
};
