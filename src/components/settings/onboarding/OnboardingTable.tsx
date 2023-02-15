import { FC } from 'react';
import { TableRowKit, TableCellKit } from 'kits';
import useTableContentFormatter from 'components/tableRevly/tableContentFormatter/useTableContentFormatter';
import TableRevly from 'components/tableRevly/TableRevly';

const OnboardingTable: FC<{
  branchData: any;
  openCloseModal: any;
  setConnectAccount: any;
  setClickedBranch: any;
}> = ({ branchData, openCloseModal, setConnectAccount, setClickedBranch }) => {
  const { renderAccountsRow, renderBranchStatusRow, renderBranchRow, renderLinkedPlatformsRow } =
    useTableContentFormatter();
  const headersOnBoarding = [
    {
      id: 'branch_name',
      numeric: false,
      disablePadding: false,
      label: 'Branch Name',
    },
    {
      id: 'accounts',
      numeric: false,
      disablePadding: false,
      label: 'Accounts',
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
      label: 'Branch Status',
    },
  ];

  const /* A map of functions that will be used to render the cells. */
    cellTemplatesObject = {
      branch_name: renderBranchRow,
      accounts: renderAccountsRow,
      linked_platforms: renderLinkedPlatformsRow,
      branch_status: renderBranchStatusRow,
    };
  const renderRowsByHeader = (r) =>
    headersOnBoarding.reduce(
      (acc, cur) => ({
        ...acc,
        [cur.id]: cellTemplatesObject[cur.id](r, cur),
        id: `${cur.id}_${r.id}`,
        data: r,
      }),
      {}
    );
  const renderNoData = () => (
    <TableRowKit>
      <TableCellKit colSpan={7}>
        <div className='onboarding-no-data'>
          <div className='onboarding-no-data_skeleton'>
            {[0, 1, 2].map((n) => (
              <div key={n}>
                <span />
              </div>
            ))}
          </div>
          <p className='__title'>Get Started by connecting one of your accounts </p>
          <span className='__subtitle'>
            click on “ add new account “ button to connect to allow access to your delivery platform
            Information
          </span>
        </div>
      </TableCellKit>
    </TableRowKit>
  );
  const onClickRow = (id: any) => {
    const data = branchData.find((obj) => String(`branch_status_${obj.id}`) === String(id));

    if (data.branch_status !== 'in process') {
      setConnectAccount('manageBranch');
      openCloseModal();
      setClickedBranch(data);
    }
  };

  return (
    <div className='settings-onboarding bg onboarding-table'>
      <TableRevly
        renderNoData={renderNoData()}
        headers={headersOnBoarding}
        rows={branchData.map(renderRowsByHeader)}
        onClickRow={onClickRow}
      />
    </div>
  );
};

export default OnboardingTable;
