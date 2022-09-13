import * as React from 'react';
import TableRow from '@mui/material/TableRow';
import TableContainerKit from '../../kits/tablecontainer/TableContainerKit';
import TableKit from '../../kits/table/TableKit';
import TableHeadKit from '../../kits/tablehead/TableHeadKit';
import TableRowKit from '../../kits/tablerow/TableRowKit';
import TableCellKit from '../../kits/tablecell/TableCellKit';
import TableBodyKit from '../../kits/tablebody/TableBodyKit';
import PaperKit from '../../kits/paper/PaperKit';
import "./PlanningOffersTable.scss";

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("dasd", 159, 6.0, 24, 4.0),
  createData('Ice cream ', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

export default function PlanningOffersTable() {
  return (
    <TableContainerKit className="planning_offers-table-container" component={PaperKit}>
      <TableKit sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHeadKit className="planning_table-head">
          <TableRowKit>
            <TableCellKit>Date</TableCellKit>
            <TableCellKit >branche</TableCellKit>
            <TableCellKit >plotform</TableCellKit>
            <TableCellKit >Day</TableCellKit>
            <TableCellKit >slot</TableCellKit>
            <TableCellKit >Discount type</TableCellKit>
            <TableCellKit >%</TableCellKit>
            <TableCellKit >Min. Order</TableCellKit>
            <TableCellKit >Target</TableCellKit>
            <TableCellKit >Status</TableCellKit>

          </TableRowKit>
        </TableHeadKit>
        <TableBodyKit>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCellKit >
                {
                  new Date().toLocaleDateString()
                }
              </TableCellKit>
              <TableCellKit >{row.calories}</TableCellKit>
              <TableCellKit >{row.fat}</TableCellKit>
              <TableCellKit >{row.carbs}</TableCellKit>
              <TableCellKit >{row.protein}</TableCellKit>
              <TableCellKit >{row.protein}</TableCellKit>
              <TableCellKit >{row.protein}</TableCellKit>
              <TableCellKit >{row.protein}</TableCellKit>
              <TableCellKit >{row.protein}</TableCellKit>
              <TableCellKit >{row.protein}</TableCellKit>
            </TableRow>
          ))}
        </TableBodyKit>
      </TableKit>
    </TableContainerKit>
  );
}