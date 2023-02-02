import { atom } from 'jotai';
import type { TVendors } from 'hooks/useVendors';

export const vendorsAtom = atom<TVendors>({
  vendorsSelected: [],
  vendorsObj: {},
  vendorsArr: [],
  display: {},
  chainObj: {},
});

export default vendorsAtom;
