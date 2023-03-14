import { atom } from 'jotai';

export type TOnboardingBranchData = {
  branch_name?: string;
  accounts?: string[];
  linked_platforms?: {
    email?: string;
    platform?: string;
    status?: string;
  }[];
  branch_status?: string;
  id?: string | number;
  chain_name?: string;
};

export const onboardingLoadingAtom = atom(false);

export const onboardingOpenedModalAtom = atom(false);

export const onboardingActiveStepAtom = atom(0);

export const onboardingBranchDataUploadingAtom = atom<TOnboardingBranchData[]>([]);

export const onboardingBranchDataAtom = atom<TOnboardingBranchData[]>([]);

export const onboardingBranchDataFilteredAtom = atom<TOnboardingBranchData[]>([]);

export const onboardingConnectAccountAtom = atom('account');

export const onboardingConnectAtom = atom('');

export const onboardingClickedBranchAtom = atom<TOnboardingBranchData>({});

export const onboardingAccountsAtom = atom([]);
