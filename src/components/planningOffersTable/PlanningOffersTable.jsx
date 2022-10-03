import React from 'react';
import { noCase, sentenceCase } from 'change-case';

import './PlanningOffersTable.scss';

import TableHeadKit from '../../kits/tablehead/TableHeadKit';
import TableRowKit from '../../kits/tablerow/TableRowKit';
import TableCellKit from '../../kits/tablecell/TableCellKit';
import TableSortLabelKit from '../../kits/tablesortlabel/TableSortLableKit';
import BoxKit from '../../kits/box/BoxKit';
import PaperKit from '../../kits/paper/PaperKit';
import TableContainerKit from '../../kits/tablecontainer/TableContainerKit';
import TableKit from '../../kits/table/TableKit';
import TableBodyKit from '../../kits/tablebody/TableBodyKit';
import deliveroo from '../../assets/images/deliveroo.png';
import talabat from '../../assets/images/talabat.png';

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

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'vendor_name',
    numeric: false,
    disablePadding: true,
    label: 'Vendor Name',
  },
  {
    id: 'platform',
    numeric: true,
    disablePadding: false,
    label: 'Platform',
  },
  {
    id: 'discount_type',
    numeric: true,
    disablePadding: false,
    label: 'Discount Type',
  },
  {
    id: 'discount_rate',
    numeric: true,
    disablePadding: false,
    label: 'Discount Rate',
  },
  {
    id: 'minimum_order_value',
    numeric: true,
    disablePadding: false,
    label: 'Min.Order',
  },
  {
    id: 'start_date',
    numeric: true,
    disablePadding: false,
    label: 'Start Date',
  },
  {
    id: 'end_date',
    numeric: true,
    disablePadding: false,
    label: 'End Date',
  },
  {
    id: 'target',
    numeric: true,
    disablePadding: false,
    label: 'Target',
  },
  {
    id: 'status',
    numeric: true,
    disablePadding: false,
    label: 'Status',
  },
];

const EnhancedTableHead = (props) => {
  const { order, orderBy, onRequestSort, header } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHeadKit>
      <TableRowKit>
        {header.map((headCell) => (
          <TableCellKit
            key={headCell.id}
            align="left"
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}>
            <TableSortLabelKit
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}>
              {headCell.label}
              {orderBy === headCell.id ? (
                <BoxKit component="span" sx={{ display: 'none' }}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </BoxKit>
              ) : null}
            </TableSortLabelKit>
          </TableCellKit>
        ))}
      </TableRowKit>
    </TableHeadKit>
  );
};

const PlanningOffersTable = ({ rows }) => {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('name');
  const [selected, setSelected] = React.useState([]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const getHeadCells = () => {
    if (!rows[0]) return headCells;

    return Object.keys(rows[0]).map((k) => ({
      id: k,
      numeric: Number.isNaN(rows[0][k]),
      disablePadding: true,
      label: sentenceCase(noCase(k)),
    }));
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const renderRowsByHeader = (r) =>
    getHeadCells().map((h) => {
      if (h.id !== 'platform')
        return <TableCellKit key={h.id}>{r[h.id] === null ? '-' : r[h.id]}</TableCellKit>;

      return (
        <TableCellKit key={h.id}>
          <img
            className="planning-platform"
            src={r.platform === 'deliveroo' ? deliveroo : talabat}
            alt={r.platform}
          />
        </TableCellKit>
      );
    });

  return (
    <BoxKit className="competition-box planning-box" sx={{ width: '100%' }}>
      <PaperKit className="competition-table-paper" sx={{ width: '100%', mb: 2 }}>
        <TableContainerKit className="planning-table-container competition-table-conatiner">
          <TableKit sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              header={getHeadCells()}
            />
            <TableBodyKit>
              {stableSort(rows, getComparator(order, orderBy)).map((row) => {
                const isItemSelected = isSelected(row.vendor_name);
                return (
                  <TableRowKit
                    onClick={(event) => handleClick(event, row.name)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}>
                    {renderRowsByHeader(row)}
                  </TableRowKit>
                );
              })}
            </TableBodyKit>
          </TableKit>
        </TableContainerKit>
      </PaperKit>
    </BoxKit>
  );
};

export default PlanningOffersTable;
