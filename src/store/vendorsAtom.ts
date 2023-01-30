import { atom } from 'jotai';

export const vendorsAtom = atom({
  vendorsSelected: [],
  vendorsObj: {},
  vendorsArr: [],
  display: {},
  chainObj: {},
});

export default vendorsAtom;
