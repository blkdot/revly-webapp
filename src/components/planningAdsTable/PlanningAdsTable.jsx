import * as React from 'react';
import TableRow from '@mui/material/TableRow';
import TableContainerKit from '../../kits/tablecontainer/TableContainerKit';
import TableKit from '../../kits/table/TableKit';
import TableHeadKit from '../../kits/tablehead/TableHeadKit';
import TableRowKit from '../../kits/tablerow/TableRowKit';
import TableCellKit from '../../kits/tablecell/TableCellKit';
import TableBodyKit from '../../kits/tablebody/TableBodyKit';
import PaperKit from '../../kits/paper/PaperKit';

const PlanningAdsTable = ({ rows }) => (
  <TableContainerKit className="planning_offers-table-container" component={PaperKit}>
    <TableKit sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHeadKit className="planning_table-head">
        <TableRowKit>
          <TableCellKit>Date</TableCellKit>
          <TableCellKit>branche</TableCellKit>
          <TableCellKit>platform</TableCellKit>
          <TableCellKit>Day</TableCellKit>
          <TableCellKit>slot</TableCellKit>
          <TableCellKit>Bid</TableCellKit>
          <TableCellKit>Budget</TableCellKit>
          <TableCellKit>Target</TableCellKit>
          <TableCellKit>Status</TableCellKit>
        </TableRowKit>
      </TableHeadKit>
      <TableBodyKit>
        {rows.map((row) => (
          <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCellKit>{row.date.toLocaleDateString()}</TableCellKit>
            <TableCellKit>{row.branche}</TableCellKit>
            <TableCellKit>{row.platform}</TableCellKit>
            <TableCellKit>{row.day.toLocaleDateString()}</TableCellKit>
            <TableCellKit>{row.slot}</TableCellKit>
            <TableCellKit>{row.bid}</TableCellKit>
            <TableCellKit>{row.budget}</TableCellKit>
            <TableCellKit>{row.target}</TableCellKit>
            <TableCellKit>{row.status}</TableCellKit>
          </TableRow>
        ))}
      </TableBodyKit>
    </TableKit>
  </TableContainerKit>
);

export default PlanningAdsTable;
