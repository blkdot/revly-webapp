import { atom } from 'jotai';
import { TVendors } from 'types';

export const vendorsAtom = atom<TVendors>({
  vendorsSelected: [],
  vendorsObj: {},
  vendorsArr: [],
  display: {},
  chainObj: {},
  chainData: [],
});

export const vendorsIsolatedAtom = atom<TVendors>({
  vendorsSelected: [],
  vendorsObj: {},
  vendorsArr: [],
  display: {},
  chainObj: {},
  chainData: [],
});

export default vendorsAtom;
