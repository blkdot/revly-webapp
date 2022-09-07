import React from 'react';
import PropTypes from 'prop-types';
import MovingIcon from '@mui/icons-material/Moving';
import { visuallyHidden } from '@mui/utils';

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

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort, headCells } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHeadKit className='table-head'>
      <TableRowKit>
        {headCells.map((headCell) => (
          <TableCellKit
            className='enchanced-table-cell'
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabelKit
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <BoxKit component='span' sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </BoxKit>
              ) : null}
            </TableSortLabelKit>
          </TableCellKit>
        ))}
      </TableRowKit>
    </TableHeadKit>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default function EnhancedTable({ rows, type }) {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
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

  const handleClick = (name) => {
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
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const headCells = [
    {
      id: 'name',
      numeric: false,
      disablePadding: false,
      label: type,
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

  const getTotal = (key) => {
    return rows.reduce((a, b) => a + (b[key] || 0), 0);
  };

  return (
    <BoxKit sx={{ width: '100%' }}>
      <PaperKit className='table-paper-wrapper'>
        <TableContainerKit>
          <TableKit className='table' aria-labelledby='tableTitle' size={'medium'}>
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              headCells={headCells}
            />
            <TableBodyKit className="table-body">
              {stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
                const isItemSelected = isSelected(row.name);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRowKit
                    onClick={() => handleClick(row.name)}
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.name}
                    className='table-row'
                  >
                    <TableCellKit component='th' id={labelId} scope='row'>
                      <img className={'table-img ' + (row.name === 'deliveroo' ? 'img-del' : '')} src={row.img} alt={row.name} />
                    </TableCellKit>
                    <TableCellKit>{row.week}</TableCellKit>
                    <TableCellKit>{row.week1}</TableCellKit>
                    <TableCellKit>
                      <div
                        className={
                          'table_evolution ' +
                          (row.evolution >= 0 ? 'table_increased' : 'table_decreased')
                        }
                      >
                        <MovingIcon sx={{ color: '#fff', width: '15px' }} />
                        <span>{row.evolution > 0 ? '+' + row.evolution : row.evolution} %</span>
                      </div>
                    </TableCellKit>
                  </TableRowKit>
                );
              })}
            </TableBodyKit>
            <TableHeadKit>
              <TableRowKit className='table-row table-total'>
                <TableCellKit component='th' scope='row'>
                  Total
                </TableCellKit>
                <TableCellKit>{getTotal('week')}</TableCellKit>
                <TableCellKit>{getTotal('week1')}</TableCellKit>
                <TableCellKit>
                  <div
                    className={
                      'table_evolution ' +
                      (getTotal('evolution') >= 0 ? 'table_increased' : 'table_decreased')
                    }
                  >
                    <MovingIcon sx={{ color: '#fff', width: '15px' }} />
                    <span>
                      {getTotal('evolution') > 0
                        ? '+' + getTotal('evolution')
                        : getTotal('evolution')}{' '}
                      %
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
}
