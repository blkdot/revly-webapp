import * as React from 'react';
import AddIcon from '@mui/icons-material/Add';
import TableHeadKit from '../../kits/tablehead/TableHeadKit';
import TableRowKit from '../../kits/tablerow/TableRowKit';
import TableCellKit from '../../kits/tablecell/TableCellKit';
import TableSortLabelKit from '../../kits/tablesortlabel/TableSortLableKit';
import BoxKit from '../../kits/box/BoxKit';
import PaperKit from '../../kits/paper/PaperKit';
import TableContainerKit from '../../kits/tablecontainer/TableContainerKit';
import TableKit from '../../kits/table/TableKit';
import TableBodyKit from '../../kits/tablebody/TableBodyKit';
import './CompetitionTable.scss';
import ButtonKit from '../../kits/button/ButtonKit';
import deliveroo from '../../assets/images/deliveroo.png';
import talabat from '../../assets/images/talabat.png';
import SpinnerKit from '../../kits/spinner/SpinnerKit';

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
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Name',
  },
  {
    id: 'platform',
    numeric: true,
    disablePadding: false,
    label: 'Platform',
  },
  {
    id: 'offers',
    disablePadding: false,
    label: 'Ranking in offers',
  },
  {
    id: 'cuisine',
    numeric: true,
    disablePadding: false,
    label: 'Ranking in cuisine',
  },
  {
    id: 'ranking',
    numeric: true,
    disablePadding: false,
    label: 'Ranking in offers and cuisine',
  },
  {
    id: 'review',
    numeric: true,
    disablePadding: false,
    label: 'Overall ranking',
  },
];
const headCellsAlerts = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Name',
  },
  {
    id: 'type',
    numeric: true,
    disablePadding: false,
    label: 'Type',
  },
  {
    id: 'alert',
    numeric: true,
    disablePadding: false,
    label: 'Alert',
  },
  {
    id: 'status',
    numeric: true,
    disablePadding: false,
    label: 'Status',
  },
  {
    id: 'mov',
    numeric: true,
    disablePadding: false,
    label: 'Minimum Order Value',
  },
];

const EnhancedTableHead = (props) => {
  const { order, orderBy, onRequestSort, type } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHeadKit className={type !== 'ranking' ? 'competition-thead' : ''}>
      <TableRowKit>
        {(type === 'ranking' ? headCells : headCellsAlerts).map((headCell) => (
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
            </TableSortLabelKit>
          </TableCellKit>
        ))}
      </TableRowKit>
    </TableHeadKit>
  );
};

const CompetitionTable = ({ rows, open, type, loading }) => {
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

  const getNumArr = () => {
    const numArr = [];
    for (let i = 0; i < 5 - rows.length; i++) {
      numArr.push(i);
    }
    return numArr;
  };
  const ordinalSuffixOf = (i) => {
    const r = Math.round(i);
    return r >= 100 ? '100' : `${r}`;
  };
  const isSelected = (name) => selected.indexOf(name) !== -1;
  return (
    <BoxKit className="competition-box" sx={{ width: '100%' }}>
      <PaperKit className="competition-table-paper" sx={{ width: '100%', mb: 2 }}>
        <TableContainerKit className="competition-table-conatiner">
          <TableKit sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              type={type}
            />
            <TableBodyKit>
              {loading ? (
                <tr>
                  <td />
                  <td />
                  <td />
                  {type !== 'ranking' && <td />}
                  <td>
                    <SpinnerKit sx={{ margin: '1em 0' }} />
                  </td>
                  <td />
                  <td />
                  <td />
                  <td />
                </tr>
              ) : (
                stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
                  const isItemSelected = isSelected(row?.id);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  if (type === 'ranking') {
                    return (
                      <TableRowKit
                        role="checkbox"
                        sx={{ height: '72px' }}
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row?.id}
                        selected={isItemSelected}>
                        <TableCellKit component="th" id={labelId} scope="row">
                          {row?.name}
                        </TableCellKit>
                        <TableCellKit>
                          <img
                            className="competition-table-icon"
                            src={row?.platform === 'deliveroo' ? deliveroo : talabat}
                            alt={row?.platform}
                          />
                        </TableCellKit>
                        <TableCellKit>
                          {ordinalSuffixOf(row?.r_offers) >= 100 && '> '}
                          {ordinalSuffixOf(row?.r_offers)}
                        </TableCellKit>
                        <TableCellKit>
                          {ordinalSuffixOf(row?.r_cuis) >= 100 && '> '}
                          {ordinalSuffixOf(row?.r_cuis)}
                        </TableCellKit>
                        <TableCellKit>
                          {ordinalSuffixOf(row?.r_all) >= 100 && '> '}
                          {ordinalSuffixOf(row?.r_all)}
                        </TableCellKit>
                        <TableCellKit>
                          {ordinalSuffixOf(row?.ov) >= 100 && '> '}
                          {ordinalSuffixOf(row?.ov)}
                        </TableCellKit>
                      </TableRowKit>
                    );
                  }
                  return (
                    <TableRowKit
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row?.name}
                      selected={isItemSelected}>
                      <TableCellKit component="th" id={labelId} scope="row">
                        {row?.name}
                      </TableCellKit>
                      <TableCellKit>{row?.type}</TableCellKit>
                      <TableCellKit>
                        <span className="competition-table-alert">{row?.alert}%</span>
                      </TableCellKit>
                      <TableCellKit>
                        <span className={`competition-status ${row?.status}`}>{row?.status}</span>
                      </TableCellKit>
                      <TableCellKit align="center">
                        {row?.mov === null ? 0 : row?.mov} AED
                      </TableCellKit>
                    </TableRowKit>
                  );
                })
              )}
            </TableBodyKit>
          </TableKit>
          {type === 'ranking'
            ? getNumArr().map((num) => (
                <ButtonKit
                  onClick={() => open()}
                  key={num}
                  variant="contained"
                  className="competition-add competiton-table-btn">
                  <AddIcon />
                  Add a Competitor
                </ButtonKit>
              ))
            : ''}
        </TableContainerKit>
      </PaperKit>
    </BoxKit>
  );
};

export default CompetitionTable;
