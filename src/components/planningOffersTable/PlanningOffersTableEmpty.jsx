import * as React from 'react';
import TableRow from '@mui/material/TableRow';
import TableContainerKit from '../../kits/tablecontainer/TableContainerKit';
import TableKit from '../../kits/table/TableKit';
import TableHeadKit from '../../kits/tablehead/TableHeadKit';
import TableRowKit from '../../kits/tablerow/TableRowKit';
import TableCellKit from '../../kits/tablecell/TableCellKit';
import TableBodyKit from '../../kits/tablebody/TableBodyKit';
import PaperKit from '../../kits/paper/PaperKit';
import './PlanningOffersTable.scss';
import SkeletonKit from '../../kits/skeleton/SkeletonKit';
import BoxKit from '../../kits/box/BoxKit';

const PlanningOffersTableEmpty = () => (
  <BoxKit sx={{ width: '100%' }}>
    <TableContainerKit className="planning_offers-table-container" component={PaperKit}>
      <TableKit aria-label="simple table">
        <TableHeadKit className="planning_table-head">
          <TableRowKit>
            <TableCellKit>Vendor name</TableCellKit>
            <TableCellKit>Platform</TableCellKit>
            <TableCellKit>Discount type</TableCellKit>
            <TableCellKit>Discount rate</TableCellKit>
            <TableCellKit>Min.Order</TableCellKit>
            <TableCellKit>Start date</TableCellKit>
            <TableCellKit>End date</TableCellKit>
            <TableCellKit>Target</TableCellKit>
            <TableCellKit>Status</TableCellKit>
          </TableRowKit>
        </TableHeadKit>
        <TableBodyKit>
          {[0, 1, 2, 3].map((row) => (
            <TableRow key={row} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCellKit>
                <SkeletonKit width={80} />
              </TableCellKit>
              <TableCellKit>
                <SkeletonKit width={30} />
              </TableCellKit>
              <TableCellKit>
                <SkeletonKit width={80} />
              </TableCellKit>
              <TableCellKit>
                <SkeletonKit width={80} />
              </TableCellKit>
              <TableCellKit>
                <SkeletonKit width={80} />
              </TableCellKit>
              <TableCellKit>
                <SkeletonKit width={80} />
              </TableCellKit>
              <TableCellKit>
                <SkeletonKit width={80} />
              </TableCellKit>
              <TableCellKit>
                <SkeletonKit width={80} />
              </TableCellKit>
              <TableCellKit>
                <SkeletonKit width={80} />
              </TableCellKit>
            </TableRow>
          ))}
        </TableBodyKit>
      </TableKit>
    </TableContainerKit>
  </BoxKit>
);

export default PlanningOffersTableEmpty;
