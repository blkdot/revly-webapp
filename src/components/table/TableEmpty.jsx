// TODO: fix all linter problem
import React from 'react';

import './Table.scss';

import BoxKit from '../../kits/box/BoxKit';
import PaperKit from '../../kits/paper/PaperKit';
import TableHeadKit from '../../kits/tablehead/TableHeadKit';
import TableRowKit from '../../kits/tablerow/TableRowKit';
import TableCellKit from '../../kits/tablecell/TableCellKit';
import TableSortLabelKit from '../../kits/tablesortlabel/TableSortLableKit';
import TableContainerKit from '../../kits/tablecontainer/TableContainerKit';
import TableKit from '../../kits/table/TableKit';
import TableBodyKit from '../../kits/tablebody/TableBodyKit';

import SkeletonKit from '../../kits/skeleton/SkeletonKit';
import { platformList } from '../../data/platformList';

const headCells = [
  {
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: '',
  },
  {
    id: 'week',
    numeric: true,
    disablePadding: false,
    label: 'W',
  },
  {
    id: 'week1',
    numeric: true,
    disablePadding: false,
    label: 'W - 1',
  },
  {
    id: 'evolution',
    numeric: true,
    disablePadding: false,
    label: 'Evolution',
  },
];

const EnhancedTableHead = () => (
  <TableHeadKit className="table-head">
    <TableRowKit>
      {headCells.map((headCell) => (
        <TableCellKit className="enchanced-table-cell" key={headCell.id}>
          <TableSortLabelKit direction="asc">{headCell.label}</TableSortLabelKit>
        </TableCellKit>
      ))}
    </TableRowKit>
  </TableHeadKit>
);

const renderRow = () =>
  platformList.map((row) => (
    <TableRowKit key={row.name} className="table-row">
      <TableCellKit component="th" id={row.name} scope="row">
        <img
          className={`table-img ${row.name === 'deliveroo' ? 'img-del' : ''}`}
          src={row.src}
          alt={row.name}
        />
      </TableCellKit>
      <TableCellKit>{row.week}</TableCellKit>
      <TableCellKit>{row.week1}</TableCellKit>
      <TableCellKit>
        <div className="table_evolution">
          <span>
            <SkeletonKit variant="rectangular" width={100} />
          </span>
        </div>
      </TableCellKit>
    </TableRowKit>
  ));

const Table = () => (
  <BoxKit sx={{ width: '100%' }}>
    <PaperKit className="table-paper-wrapper">
      <TableContainerKit>
        <TableKit className="table" aria-labelledby="tableTitle" size="medium">
          <EnhancedTableHead />
          <TableBodyKit className="table-body">{renderRow()}</TableBodyKit>
          <TableHeadKit>
            <TableRowKit className="table-row table-total">
              <TableCellKit component="th" scope="row">
                Total
              </TableCellKit>
              <TableCellKit>
                <SkeletonKit variant="rectangular" width={100} />
              </TableCellKit>
              <TableCellKit>
                <SkeletonKit variant="rectangular" width={100} />
              </TableCellKit>
              <TableCellKit>
                <div className="table_evolution">
                  <span>
                    <SkeletonKit variant="rectangular" width={100} />
                  </span>
                </div>
              </TableCellKit>
            </TableRowKit>
          </TableHeadKit>
        </TableKit>
      </TableContainerKit>
    </PaperKit>
  </BoxKit>
);

export default Table;
