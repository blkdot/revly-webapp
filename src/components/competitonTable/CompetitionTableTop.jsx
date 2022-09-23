import * as React from 'react';
import TableRow from '@mui/material/TableRow';
import TableContainerKit from '../../kits/tablecontainer/TableContainerKit';
import TableKit from '../../kits/table/TableKit';
import TableHeadKit from '../../kits/tablehead/TableHeadKit';
import TableRowKit from '../../kits/tablerow/TableRowKit';
import TableCellKit from '../../kits/tablecell/TableCellKit';
import TableBodyKit from '../../kits/tablebody/TableBodyKit';
import PaperKit from '../../kits/paper/PaperKit';

const CompetitionTableTop = ({ rows }) => (
  <TableContainerKit className="planning_offers-table-container" component={PaperKit}>
    <TableKit sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHeadKit className="planning_table-head">
        <TableRowKit>
          <TableCellKit>Competitor</TableCellKit>
          <TableCellKit>Platform</TableCellKit>
          <TableCellKit>Carrousel</TableCellKit>
          <TableCellKit>Ranking in offers fill</TableCellKit>
          <TableCellKit>Ranking Cuisine</TableCellKit>
          <TableCellKit>Ranking</TableCellKit>
          <TableCellKit>Review</TableCellKit>
        </TableRowKit>
      </TableHeadKit>
      <TableBodyKit>
        {rows.map((row) => (
          <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCellKit>{row.competitor}</TableCellKit>
            <TableCellKit>{row.platform}</TableCellKit>
            <TableCellKit>{row.carrousel}</TableCellKit>
            <TableCellKit>{row.offersFill}</TableCellKit>
            <TableCellKit>{row.cuisine}</TableCellKit>
            <TableCellKit>{row.ranking}</TableCellKit>
            <TableCellKit>{row.review}</TableCellKit>
          </TableRow>
        ))}
      </TableBodyKit>
    </TableKit>
  </TableContainerKit>
);

export default CompetitionTableTop;
