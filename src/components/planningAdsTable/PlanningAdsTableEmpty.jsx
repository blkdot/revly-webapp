import * as React from 'react';

import '../planningOffersTable/PlanningOffersTable.scss';

import TableContainerKit from '../../kits/tablecontainer/TableContainerKit';
import TableKit from '../../kits/table/TableKit';
import TableHeadKit from '../../kits/tablehead/TableHeadKit';
import TableRowKit from '../../kits/tablerow/TableRowKit';
import TableCellKit from '../../kits/tablecell/TableCellKit';
import TableBodyKit from '../../kits/tablebody/TableBodyKit';
import PaperKit from '../../kits/paper/PaperKit';
import SkeletonKit from '../../kits/skeleton/SkeletonKit';
import BoxKit from '../../kits/box/BoxKit';
import TableSortLabelKit from '../../kits/tablesortlabel/TableSortLableKit';

const headCells = [
  {
    id: 'Date',
    label: 'Date',
  },
  {
    id: 'branche',
    label: 'branche',
  },
  {
    id: 'platform',
    label: 'platform',
  },
  {
    id: 'Day',
    label: 'Day',
  },
  {
    id: 'slot',
    label: 'slot',
  },
  {
    id: 'Bid',
    label: 'Bid',
  },
  {
    id: 'Budget',
    label: 'Budget',
  },
  {
    id: 'Target',
    label: 'Target',
  },
  {
    id: 'Status',
    label: 'Status',
  },
];

const EnhancedTableHead = () => (
  <TableHeadKit>
    <TableRowKit>
      {headCells.map((headCell) => (
        <TableCellKit
          key={headCell.id}
          align="left"
          padding={headCell.disablePadding ? 'none' : 'normal'}
        >
          <TableSortLabelKit>{headCell.label}</TableSortLabelKit>
        </TableCellKit>
      ))}
    </TableRowKit>
  </TableHeadKit>
);

const PlanningAdsTableEmpty = () => (
  <BoxKit className="competition-box planning-box" sx={{ width: '100%' }}>
    <PaperKit className="competition-table-paper" sx={{ width: '100%', mb: 2 }}>
      <TableContainerKit className="planning-table-container competition-table-conatiner">
        <TableKit sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
          <EnhancedTableHead />
          <TableBodyKit>
            {[1, 2, 3, 4, 5].map((n) => (
              <TableRowKit key={n}>
                <TableCellKit>
                  <SkeletonKit />
                </TableCellKit>
                <TableCellKit>
                  <SkeletonKit />
                </TableCellKit>
                <TableCellKit>
                  <SkeletonKit />
                </TableCellKit>
                <TableCellKit>
                  <SkeletonKit />
                </TableCellKit>
                <TableCellKit>
                  <SkeletonKit />
                </TableCellKit>
                <TableCellKit>
                  <SkeletonKit />
                </TableCellKit>
                <TableCellKit>
                  <SkeletonKit />
                </TableCellKit>
                <TableCellKit>
                  <SkeletonKit />
                </TableCellKit>
                <TableCellKit>
                  <SkeletonKit />
                </TableCellKit>
              </TableRowKit>
            ))}
          </TableBodyKit>
        </TableKit>
      </TableContainerKit>
    </PaperKit>
  </BoxKit>
);

export default PlanningAdsTableEmpty;
