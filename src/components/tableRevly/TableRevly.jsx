import React, { useState } from 'react';

import './TableRevly.scss';

import TableRowKit from '../../kits/tablerow/TableRowKit';
import TableCellKit from '../../kits/tablecell/TableCellKit';
import BoxKit from '../../kits/box/BoxKit';
import PaperKit from '../../kits/paper/PaperKit';
import TableContainerKit from '../../kits/tablecontainer/TableContainerKit';
import TableKit from '../../kits/table/TableKit';
import TableBodyKit from '../../kits/tablebody/TableBodyKit';
import SkeletonKit from '../../kits/skeleton/SkeletonKit';
import EnhancedTableHead from '../enhancedTableHead/EnhancedTableHead';
import { getComparator, stableSort } from '../../utlls/scripts/scripts';

const TableRevly = (props) => {
  const { headers, rows, isLoading, mainFieldOrdered } = props;
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState(mainFieldOrdered || 'name');

  const handleRequestSort = (_, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const renderSkeleton = () =>
    [1, 2, 3, 4, 5].map((n) => (
      <TableRowKit key={n}>
        {[1, 2, 3, 4, 5].map((r) => (
          <TableCellKit key={r}>
            <SkeletonKit />
          </TableCellKit>
        ))}
      </TableRowKit>
    ));

  const renderRows = () => {
    if (isLoading) return renderSkeleton();

    if (!rows || rows.length < 1)
      return (
        <TableRowKit>
          <TableCellKit colSpan={headers.length} style={{ textAlign: 'center' }}>
            <span>No data retrieved</span>
          </TableCellKit>
        </TableRowKit>
      );

    return renderRowsContent();
  };

  const renderRowsContent = () =>
    stableSort(rows, getComparator(order, orderBy)).map((r) => (
      <TableRowKit key={r.id}>
        {headers.map((h) => (
          <TableCellKit key={`${h.id}_${r.id}`}>{r[h.id]}</TableCellKit>
        ))}
      </TableRowKit>
    ));

  return (
    <BoxKit className="competition-box planning-box" sx={{ width: '100%' }}>
      <PaperKit className="competition-table-paper" sx={{ width: '100%', mb: 2 }}>
        <TableContainerKit
          id="adsContainer"
          className="planning-table-container competition-table-conatiner"
        >
          <TableKit sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
            <EnhancedTableHead
              header={headers}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length ?? 0}
            />
            <TableBodyKit>{renderRows()}</TableBodyKit>
          </TableKit>
        </TableContainerKit>
      </PaperKit>
    </BoxKit>
  );
};

export default TableRevly;
