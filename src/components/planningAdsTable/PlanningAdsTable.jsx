import * as React from 'react';
import TableRow from '@mui/material/TableRow';
import { noCase, sentenceCase } from 'change-case';

import TableContainerKit from '../../kits/tablecontainer/TableContainerKit';
import TableKit from '../../kits/table/TableKit';
import TableHeadKit from '../../kits/tablehead/TableHeadKit';
import TableRowKit from '../../kits/tablerow/TableRowKit';
import TableCellKit from '../../kits/tablecell/TableCellKit';
import TableBodyKit from '../../kits/tablebody/TableBodyKit';
import PaperKit from '../../kits/paper/PaperKit';

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

const PlanningAdsTable = ({ rows }) => {
  const getHeadCells = () => {
    if (!rows[0]) return headCells;

    return Object.keys(rows[0]).map((k) => ({
      id: k,
      label: sentenceCase(noCase(k)),
    }));
  };

  return (
    <TableContainerKit className="planning_offers-table-container" component={PaperKit}>
      <TableKit sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHeadKit className="planning_table-head">
          <TableRowKit>
            {getHeadCells().map((h) => (
              <TableCellKit key={h.id}>{h.label}</TableCellKit>
            ))}
          </TableRowKit>
        </TableHeadKit>
        <TableBodyKit>
          {rows.map((row) => (
            <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              {getHeadCells().map((h) => (
                <TableCellKit>{row[h.id]}</TableCellKit>
              ))}
            </TableRow>
          ))}
        </TableBodyKit>
      </TableKit>
    </TableContainerKit>
  );
};

export default PlanningAdsTable;
