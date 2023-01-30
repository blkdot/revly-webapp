import { useState } from 'react';
import SpinnerKit from '../../../../kits/spinner/SpinnerKit';
import TableKit from '../../../../kits/table/TableKit';
import TableBodyKit from '../../../../kits/tablebody/TableBodyKit';
import TableCellKit from '../../../../kits/tablecell/TableCellKit';
import TableContainerKit from '../../../../kits/tablecontainer/TableContainerKit';
import TableHeadKit from '../../../../kits/tablehead/TableHeadKit';
import TableRowKit from '../../../../kits/tablerow/TableRowKit';
import TableSortLabelKit from '../../../../kits/tablesortlabel/TableSortLableKit';
import './MenuTable.scss';

const headRows = [
  {
    id: 'name',
    label: 'Name',
    width: 380,
  },
  {
    id: 'category',
    label: 'Category',
  },
  {
    id: 'price',
    label: 'Price',
  },
];

const TableHead = ({ order, orderBy, onRequestSort }) => {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHeadKit>
      <TableRowKit>
        {headRows.map((headCell) => (
          <TableCellKit
            key={headCell.id}
            width={headCell.width}
            align='left'
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabelKit
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
            </TableSortLabelKit>
          </TableCellKit>
        ))}
      </TableRowKit>
    </TableHeadKit>
  );
};

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const MenuTable = (props: any) => {
  const { data, loading } = props;

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('image');

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const orders = comparator(a[0], b[0]);
      if (orders !== 0) {
        return orders;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  const renderData = () =>
    data.length > 0 ? (
      stableSort(data, getComparator(order, orderBy)).map((row) => (
        <TableRowKit key={row.id} tabIndex={-1}>
          <TableCellKit>{row.name}</TableCellKit>
          <TableCellKit>{row.category}</TableCellKit>
          <TableCellKit>AED {row.price}</TableCellKit>
        </TableRowKit>
      ))
    ) : (
      <tr>
        <td />
        <td>Empty !</td>
        <td />
      </tr>
    );

  return (
    <TableContainerKit className='menu-table'>
      <TableKit size='medium'>
        <TableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
        <TableBodyKit>
          {loading ? (
            <tr>
              <td />
              <td>
                <SpinnerKit />
              </td>
              <td />
            </tr>
          ) : (
            renderData()
          )}
        </TableBodyKit>
      </TableKit>
    </TableContainerKit>
  );
};

export default MenuTable;
