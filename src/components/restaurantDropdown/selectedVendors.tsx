const selectedVendors = (name: string, display: any, plat?: string) => {
  const arr = [];
  Object.keys(display).forEach((cName) => {
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
