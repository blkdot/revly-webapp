import sortedVendors from './soretedVendors';

const filteredPlatformVendors = (display: any, plat?: string) => {
  const arr = [];
  sortedVendors(display).forEach((cName) => {
    Object.keys(display[cName]).forEach((vName) => {
      
    });
  });
  return arr;
};
export default filteredPlatformVendors;
