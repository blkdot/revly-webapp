import { atom } from 'jotai';

export const competitionSelectedPlatformAtom = atom(['deliveroo']);

export const competitionBranchSelectedAtom = atom<string[]>([]);
