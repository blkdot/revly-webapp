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
import RatingKit from '../../kits/rating/RatingKit';
import StackKit from '../../kits/stack/StackKit';
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
    id: 'carrous',
    numeric: true,
    disablePadding: false,
    label: 'Carrous',
  },
  {
    id: 'offers',
    numeric: true,
    disablePadding: false,
    label: 'Ranking in Offers',
  },
  {
    id: 'cuisine',
    numeric: true,
    disablePadding: false,
    label: 'Ranking Cuisine',
  },
  {
    id: 'ranking',
    numeric: true,
    disablePadding: false,
    label: 'Total Ranking',
  },
  {
    id: 'review',
    numeric: true,
    disablePadding: false,
    label: 'Review',
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
    id: 'start_date',
    numeric: true,
    disablePadding: false,
    label: 'Starting Date',
  },
  {
    id: 'end_date',
    numeric: true,
    disablePadding: false,
    label: 'Ending Date',
  },
  {
    id: 'start_hour',
    numeric: true,
    disablePadding: false,
    label: 'Starting Hour',
  },
  {
    id: 'end_hour',
    numeric: true,
    disablePadding: false,
    label: 'Ending Hour',
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
    label: 'MOV',
  },
];

const EnhancedTableHead = (props) => {
  const { order, orderBy, onRequestSort, type } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHeadKit>
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
  const getNumArr = () => {
    const numArr = [];
    for (let i = 0; i < 5 - rows.length; i++) {
      numArr.push(i);
    }
    return numArr;
  };
  const ordinalSuffixOf = (i) => {
    const j = i % 10;
    const k = i % 100;
    if (j === 1 && k !== 11) {
      return `${i}st`;
    }
    if (j === 2 && k !== 12) {
      return `${i}nd`;
    }
    if (j === 3 && k !== 13) {
      return `${i}rd`;
    }
    return `${i}th`;
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
                  <td />
                  <td>
                    <SpinnerKit />
                  </td>
                  <td />
                  <td />
                  <td />
                  <td />
                </tr>
              ) : (
                stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  if (type === 'ranking') {
                    return (
                      <TableRowKit
                        onClick={(event) => handleClick(event, row.name)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.name}
                        selected={isItemSelected}>
                        <TableCellKit component="th" id={labelId} scope="row">
                          {row.name}
                        </TableCellKit>
                        <TableCellKit>
                          <img
                            className="competition-table-icon"
                            src={row.platform === 'deliveroo' ? deliveroo : talabat}
                            alt={row.platform}
                          />
                        </TableCellKit>
                        <TableCellKit>{row.carrous}</TableCellKit>
                        <TableCellKit>{ordinalSuffixOf(row.offers)}</TableCellKit>
                        <TableCellKit>{ordinalSuffixOf(row.cuisine)}</TableCellKit>
                        <TableCellKit>{ordinalSuffixOf(row.ranking)}</TableCellKit>
                        <TableCellKit>
                          <StackKit spacing={1}>
                            <RatingKit
                              name="size-large"
                              value={row.review}
                              precision={0.1}
                              size="large"
                              readOnly
                            />
                          </StackKit>
                          {row.review}
                        </TableCellKit>
                      </TableRowKit>
                    );
                  }

                  return (
                    <TableRowKit
                      onClick={(event) => handleClick(event, row.name)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.name}
                      selected={isItemSelected}>
                      <TableCellKit component="th" id={labelId} scope="row">
                        {row.name}
                      </TableCellKit>
                      <TableCellKit>{row.type}</TableCellKit>
                      <TableCellKit>
                        <span className="competition-table-alert">{row.alert}%</span>
                      </TableCellKit>
                      <TableCellKit>{row.start_date}</TableCellKit>
                      <TableCellKit>{row.end_date || '-'}</TableCellKit>
                      <TableCellKit>{row.start_hour || '-'}</TableCellKit>
                      <TableCellKit>{row.end_hour || '-'}</TableCellKit>
                      <TableCellKit>
                        <span className={`competition-status ${row.status}`}>{row.status}</span>
                      </TableCellKit>
                      <TableCellKit>{row.mov} AED</TableCellKit>
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
