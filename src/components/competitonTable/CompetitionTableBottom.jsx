import * as React from 'react';
import TableRow from '@mui/material/TableRow';
import TableContainerKit from '../../kits/tablecontainer/TableContainerKit';
import TableKit from '../../kits/table/TableKit';
import TableHeadKit from '../../kits/tablehead/TableHeadKit';
import TableRowKit from '../../kits/tablerow/TableRowKit';
import TableCellKit from '../../kits/tablecell/TableCellKit';
import TableBodyKit from '../../kits/tablebody/TableBodyKit';
import PaperKit from '../../kits/paper/PaperKit';

const CompetitionTableBottom = ({ rows }) => (
  <TableContainerKit className="planning_offers-table-container" component={PaperKit}>
    <TableKit sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHeadKit className="planning_table-head">
        <TableRowKit>
          <TableCellKit>Competitor</TableCellKit>
          <TableCellKit>Alerts</TableCellKit>
          <TableCellKit>Starting Date</TableCellKit>
          <TableCellKit>Ending Date</TableCellKit>
          <TableCellKit>Starting hour</TableCellKit>
          <TableCellKit>Ending hour</TableCellKit>
          <TableCellKit>status</TableCellKit>
        </TableRowKit>
      </TableHeadKit>
      <TableBodyKit>
        {rows.map((row) => (
          <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCellKit>{row.competitor}</TableCellKit>
            <TableCellKit>{row.alerts}</TableCellKit>
            <TableCellKit>{row.start_date}</TableCellKit>
            <TableCellKit>{row.end_date}</TableCellKit>
            <TableCellKit>{row.start_hour}</TableCellKit>
            <TableCellKit>{row.end_hour}</TableCellKit>
            <TableCellKit>{row.status}</TableCellKit>
          </TableRow>
        ))}
      </TableBodyKit>
    </TableKit>
  </TableContainerKit>
);

export default CompetitionTableBottom;
