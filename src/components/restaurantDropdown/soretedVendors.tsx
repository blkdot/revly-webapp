const sortedVendors = (display: any) =>
  Object.keys(display).sort((a, b) => {
    const displayA = Object.keys(display[a]).some((vName) => display[a][vName].is_matched);
    const displayB = Object.keys(display[b]).some((vName) => display[b][vName].is_matched);
    if (displayA === displayB) {
      return 0;
    }
    if (displayA) {
      return -1;
    }
    return 1;
  });

export default sortedVendors;
