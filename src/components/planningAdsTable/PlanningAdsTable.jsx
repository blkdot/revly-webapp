import * as React from 'react';

import { noCase, sentenceCase } from 'change-case';

import TableContainerKit from '../../kits/tablecontainer/TableContainerKit';
import TableKit from '../../kits/table/TableKit';
import TableHeadKit from '../../kits/tablehead/TableHeadKit';
import TableRowKit from '../../kits/tablerow/TableRowKit';
import TableCellKit from '../../kits/tablecell/TableCellKit';
import TableBodyKit from '../../kits/tablebody/TableBodyKit';
import PaperKit from '../../kits/paper/PaperKit';
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

const EnhancedTableHead = ({ header }) => (
  <TableHeadKit>
    <TableRowKit>
      {header.map((headCell) => (
        <TableCellKit key={headCell.id} align="left" padding="normal">
          <TableSortLabelKit>{headCell.label}</TableSortLabelKit>
        </TableCellKit>
      ))}
    </TableRowKit>
  </TableHeadKit>
);

const PlanningAdsTable = ({ rows }) => {
  const getHeadCells = () => {
    if (!rows[0]) return headCells;

    return Object.keys(rows[0]).map((k) => ({
      id: k,
      label: sentenceCase(noCase(k)),
    }));
  };

  return (
    <BoxKit className="planning-box" sx={{ width: '100%' }}>
      <PaperKit className="competition-table-paper" sx={{ width: '100%', mb: 2 }}>
        <TableContainerKit className="planning-table-container">
          <TableKit aria-labelledby="tableTitle" size="medium">
            <EnhancedTableHead header={getHeadCells()} />
            <TableBodyKit>
              {rows.map((row) => (
                <TableRowKit key={row.id}>
                  {getHeadCells().map((h) => (
                    <TableCellKit key={h.id}>{row[h.id]}</TableCellKit>
                  ))}
                </TableRowKit>
              ))}
            </TableBodyKit>
          </TableKit>
        </TableContainerKit>
      </PaperKit>
    </BoxKit>
  );
};

export default PlanningAdsTable;
