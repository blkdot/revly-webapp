import * as React from 'react';
import TableHeadKit from '../../kits/tablehead/TableHeadKit';
import TableRowKit from '../../kits/tablerow/TableRowKit';
import TableCellKit from '../../kits/tablecell/TableCellKit';
import TableSortLabelKit from '../../kits/tablesortlabel/TableSortLableKit';
import BoxKit from '../../kits/box/BoxKit';
import PaperKit from '../../kits/paper/PaperKit';
import TableContainerKit from '../../kits/tablecontainer/TableContainerKit';
import TableKit from '../../kits/table/TableKit';
import TableBodyKit from '../../kits/tablebody/TableBodyKit';
import './PlanningOffersTable.scss';
import SkeletonKit from '../../kits/skeleton/SkeletonKit';

const headCells = [
  {
    id: 'vendor_name',
    numeric: false,
    disablePadding: true,
    label: 'Vendor Name',
  },
  {
    id: 'platform',
    numeric: true,
    disablePadding: false,
    label: 'Platform',
  },
  {
    id: 'discount_type',
    numeric: true,
    disablePadding: false,
    label: 'Discount Type',
  },
  {
    id: 'discount_rate',
    numeric: true,
    disablePadding: false,
    label: 'Discount Rate',
  },
  {
    id: 'minimum_order_value',
    numeric: true,
    disablePadding: false,
    label: 'Min.Order',
  },
  {
    id: 'start_date',
    numeric: true,
    disablePadding: false,
    label: 'Start Date',
  },
  {
    id: 'end_date',
    numeric: true,
    disablePadding: false,
    label: 'End Date',
  },
  {
    id: 'target',
    numeric: true,
    disablePadding: false,
    label: 'Target',
  },
  {
    id: 'status',
    numeric: true,
    disablePadding: false,
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
          padding={headCell.disablePadding ? 'none' : 'normal'}>
          <TableSortLabelKit>{headCell.label}</TableSortLabelKit>
        </TableCellKit>
      ))}
    </TableRowKit>
  </TableHeadKit>
);

const PlanningOffersTableEmpty = () => (
  <BoxKit className="competition-box planning-box" sx={{ width: '100%' }}>
    <PaperKit className="competition-table-paper" sx={{ width: '100%', mb: 2 }}>
      <TableContainerKit
        id="adsContainer"
        className="planning-table-container competition-table-conatiner">
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

export default PlanningOffersTableEmpty;
