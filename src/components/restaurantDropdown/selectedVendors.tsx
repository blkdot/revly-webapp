const selectedVendors = (name: string, display: any, plat?: string) => {
  const arr = [];
  const getSortedDisplay = () =>
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
  getSortedDisplay().forEach((cName) => {
    Object.keys(display[cName]).forEach((vName) => {
      if (display[cName][vName].checked) {
        if (name === 'name') {
          arr.push(vName);
        } else if (name === 'full') {
          arr.push(display[cName][vName].platforms[plat]);
        } else {
          arr.push(display[cName][vName]);
        }
      }
    });
  });
  return arr;
};
export default selectedVendors;
