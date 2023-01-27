import { useState } from 'react';

import './TableRevly.scss';

import BoxKit from '../../kits/box/BoxKit';
import PaperKit from '../../kits/paper/PaperKit';
import SkeletonKit from '../../kits/skeleton/SkeletonKit';
import TableKit from '../../kits/table/TableKit';
import TableBodyKit from '../../kits/tablebody/TableBodyKit';
import TableCellKit from '../../kits/tablecell/TableCellKit';
import TableContainerKit from '../../kits/tablecontainer/TableContainerKit';
import TableRowKit from '../../kits/tablerow/TableRowKit';
import { getComparator, stableSort } from '../../utlls/scripts/scripts';
import EnhancedTableHead from '../enhancedTableHead/EnhancedTableHead';

const TableRevly = (props: any) => {
  const { headers, rows, isLoading, mainFieldOrdered, onClickRow } = props;
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState(mainFieldOrdered || 'name');

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const renderSkeleton = () =>
    [1, 2, 3, 4, 5].map((n) => (
      <TableRowKit key={n}>
        {headers.map((h) => (
          <TableCellKit key={h.id}>
            <SkeletonKit />
          </TableCellKit>
        ))}
      </TableRowKit>
    ));

  const renderRows = () => {
    if (isLoading) return renderSkeleton();

    if (!rows || rows.length < 1)
      return (
        <TableRowKit className="no-data">
          <TableCellKit colSpan={7} style={{ textAlign: 'center' }}>
            <span>No data retrieved</span>
          </TableCellKit>
        </TableRowKit>
      );

    return renderRowsContent();
  };

  const handleRowClick = (id) => () => {
    if (!onClickRow) return;

    onClickRow(id);
  };

  const renderRowsContent = () =>
    stableSort(rows, getComparator(order, orderBy)).map((r) => (
      <TableRowKit
        className="marketing-table-top"
        onClick={handleRowClick(r.data.master_offer_id)}
        key={r.data.master_offer_id ? r.data.master_offer_id : r.id}
      >
        {headers.map((h) => r[h.id])}
      </TableRowKit>
    ));
  return (
    <BoxKit className="competition-box" sx={{ width: '100%' }}>
      <PaperKit className="competition-table-paper" sx={{ width: '100%', mb: 2 }}>
        <TableContainerKit id="tableContainer">
          <TableKit
            sx={{ minWidth: 750, maxHeight: 250 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
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
