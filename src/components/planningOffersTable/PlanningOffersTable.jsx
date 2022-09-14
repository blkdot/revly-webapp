import * as React from 'react';
import TableRow from '@mui/material/TableRow';
import TableContainerKit from '../../kits/tablecontainer/TableContainerKit';
import TableKit from '../../kits/table/TableKit';
import TableHeadKit from '../../kits/tablehead/TableHeadKit';
import TableRowKit from '../../kits/tablerow/TableRowKit';
import TableCellKit from '../../kits/tablecell/TableCellKit';
import TableBodyKit from '../../kits/tablebody/TableBodyKit';
import PaperKit from '../../kits/paper/PaperKit';

export default function PlanningOffersTable({rows}) {
  return (
    <TableContainerKit className="planning_offers-table-container" component={PaperKit}>
      <TableKit sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHeadKit className="planning_table-head">
          <TableRowKit>
            <TableCellKit>Date</TableCellKit>
            <TableCellKit>branche</TableCellKit>
            <TableCellKit>platform</TableCellKit>
            <TableCellKit>Day</TableCellKit>
            <TableCellKit>slot</TableCellKit>
            <TableCellKit>Discount type</TableCellKit>
            <TableCellKit>%</TableCellKit>
            <TableCellKit>Min. Order</TableCellKit>
            <TableCellKit>Target</TableCellKit>
            <TableCellKit>Status</TableCellKit>

          </TableRowKit>
        </TableHeadKit>
        <TableBodyKit>
          {rows.map((row) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCellKit >
                {row.date.toLocaleDateString()}
              </TableCellKit>
              <TableCellKit>{row.branche}</TableCellKit>
              <TableCellKit>{row.platform}</TableCellKit>
              <TableCellKit>{row.day.toLocaleDateString()}</TableCellKit>
              <TableCellKit>{row.slot}</TableCellKit>
              <TableCellKit>{row.discountType}</TableCellKit>
              <TableCellKit>{row.procent}</TableCellKit>
              <TableCellKit>{row.minOrder}</TableCellKit>
              <TableCellKit>{row.target}</TableCellKit>
              <TableCellKit>{row.status}</TableCellKit>
            </TableRow>
          ))}
        </TableBodyKit>
      </TableKit>
    </TableContainerKit>
  );
}