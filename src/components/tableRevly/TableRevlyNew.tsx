import {
  BoxKit,
  PaperKit,
  SkeletonKit,
  TableBodyKit,
  TableCellKit,
  TableContainerKit,
  TableKit,
  TableRowKit,
} from 'kits';
import { FC, ReactNode, useState } from 'react';
import noData from '../../assets/images/no-result.svg';
import { getComparator, stableSort } from '../../utils/scripts/scripts';
import EnhancedTableHead from '../enhancedTableHead/EnhancedTableHead';
import TableLink from './tableLink/TableLink';
import './TableRevly.scss';

const TableRevlyNew: FC<{
  headers: any[];
  rows: any[];
  isLoading?: boolean;
  mainFieldOrdered?: string;
  // eslint-disable-next-line react/require-default-props
  mainOrder?: 'asc' | 'desc';
  onClickRow?: (id: string | number) => void;
  noEmptyMessage?: boolean;
  renderCustomSkelton?: any[];
  links?: { link: string; title: string; tooltip?: string }[];
  setLink?: (v: string) => void;
  link?: string;
  setOpenedFilter?: (v: boolean) => void;
  className?: string;
  noDataText?: string;
  filters?: ReactNode | null;
}> = ({
  headers,
  rows,
  isLoading,
  mainFieldOrdered,
  mainOrder,
  onClickRow,
  noEmptyMessage,
  renderCustomSkelton,
  links,
  setLink,
  link,
  setOpenedFilter,
  className,
  noDataText,
  filters,
}) => {
  const [order, setOrder] = useState(mainOrder || 'asc');
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

  const handleRowClick = (id) => () => {
    if (!onClickRow) return;

    onClickRow(id);
  };

  const renderRowsContent = () =>
    stableSort(rows, getComparator(order, orderBy)).map((r) => (
      <TableRowKit className='marketing-table-top' onClick={handleRowClick(r.id)} key={r.id}>
        {headers.map((h) => r[h.id])}
      </TableRowKit>
    ));
  const renderRows = () => {
    if (isLoading)
      return renderCustomSkelton
        ? renderCustomSkelton.map((r) => (
            <TableRowKit className='marketing-table-top' key={r.id}>
              {headers.map((h) => r[h.id])}
            </TableRowKit>
          ))
        : renderSkeleton();

    if (!rows || rows.length < 1) {
      return null;
    }

    return renderRowsContent();
  };
  const renderTop = () => {
    if (links) {
      return (
        <TableLink
          links={links}
          setLink={setLink}
          link={link}
          filters={filters}
          setOpenedFilter={setOpenedFilter}
        />
      );
    }
    return '';
  };

  const renderNoData = () => {
    if (!rows || (rows.length < 1 && !isLoading)) {
      if (noEmptyMessage) {
        return null;
      }
      return (
        <div className='no-data'>
          <img src={noData} alt='no-data' />
          <p>{noDataText || 'Files not found description here'}</p>
        </div>
      );
    }
    return null;
  };
  return (
    <TableContainerKit className='table-container'>
      <TableKit
        sx={{ minWidth: 750, maxHeight: 250 }}
        aria-labelledby='tableTitle'
        size='medium'
        style={{ '--length': Object.keys(headers).length }}
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
      {renderNoData()}
    </TableContainerKit>
  );
};
TableRevlyNew.defaultProps = {
  isLoading: null,
  mainFieldOrdered: null,
  onClickRow: null,
  noEmptyMessage: null,
  renderCustomSkelton: null,
  links: null,
  setLink: null,
  link: null,
  setOpenedFilter: null,
  className: '',
  filters: null,
  noDataText: '',
};

export default TableRevlyNew;
