import { FC } from 'react';
import useTableContentFormatter from 'components/tableRevly/tableContentFormatter/useTableContentFormatter';
import TableRevlyNew from 'components/tableRevly/TableRevlyNew';
import { useAtom } from 'jotai';
import {
  onboardingBranchDataAtom,
  onboardingBranchDataFilteredAtom,
  onboardingClickedBranchAtom,
  onboardingConnectAccountAtom,
  onboardingLoadingAtom,
} from 'store/onboardingAtom';

const OnboardingTable: FC<{
  openCloseModal: () => void;
}> = ({ openCloseModal }) => {
  const [branchDataAtom] = useAtom(onboardingBranchDataAtom);
  const [branchDataFiltered] = useAtom(onboardingBranchDataFilteredAtom);
  const branchData = branchDataFiltered.length > 0 ? branchDataFiltered : branchDataAtom;
  const [, setConnectAccount] = useAtom(onboardingConnectAccountAtom);
  const [, setClickedBranch] = useAtom(onboardingClickedBranchAtom);
  const [loading] = useAtom(onboardingLoadingAtom);
  const {
    renderAccountsRow,
    renderStatus,
    renderSimpleRow,
    renderLinkedPlatformsRow,
    renderSimpleRowSkeleton,
    renderPlatformSkeleton,
    renderPercentSkeleton,
  } = useTableContentFormatter();
  const headersOnBoarding = [
    {
      id: 'branch_name',
      numeric: false,
      disablePadding: false,
      label: 'Branches',
    },
    {
      id: 'accounts',
      numeric: false,
      disablePadding: false,
      label: 'Logged Account',
    },
    {
      id: 'linked_platforms',
      numeric: false,
      disablePadding: false,
      label: 'Linked Platforms',
    },
    {
      id: 'branch_status',
      numeric: false,
      disablePadding: false,
      label: 'Status',
    },
  ];

  const /* A map of functions that will be used to render the cells. */
    cellTemplatesObject = {
      branch_name: renderSimpleRow,
      accounts: renderAccountsRow,
      linked_platforms: renderLinkedPlatformsRow,
      branch_status: renderStatus,
    };
  const renderRowsByHeader = (r) =>
    headersOnBoarding.reduce(
      (acc, cur) => ({
        ...acc,
        [cur.id]: cellTemplatesObject[cur.id](r, cur),
        id: `${r.id}_branch`,
        data: r,
      }),
      {}
    );
  const cellTemplatesObjectLoading = {
    branch_name: renderSimpleRowSkeleton,
    accounts: renderSimpleRowSkeleton,
    linked_platforms: renderPlatformSkeleton,
    branch_status: renderPercentSkeleton,
  };
  const renderRowsByHeaderLoading = (r) =>
    headersOnBoarding.reduce(
      (acc, cur) => ({
        ...acc,
        [cur.id]: cellTemplatesObjectLoading[cur.id](cur),
        id: r,
      }),
      {}
    );
  const onClickRow = (id: any) => {
    const { data }: any = branchData
      .map(renderRowsByHeader)
      .find((obj: any) => `${obj.data.id}_branch` === id);
    setConnectAccount('manageBranch');
    openCloseModal();
    setClickedBranch(data);
  };

  return (
    <TableRevlyNew
      renderCustomSkelton={[0, 1, 2, 3].map(renderRowsByHeaderLoading)}
      isLoading={loading}
      headers={headersOnBoarding}
      rows={branchData.map(renderRowsByHeader)}
      onClickRow={onClickRow}
      className='onboarding-table'
    />
  );
};

export default OnboardingTable;
