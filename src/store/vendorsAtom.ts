import type { TVendors } from 'hooks/useVendors';
import { atom } from 'jotai';

export const vendorsAtom = atom<TVendors>({
  vendorsSelected: [],
  vendorsObj: {},
  vendorsArr: [],
  display: {},
  chainObj: {},
});

export default vendorsAtom;
