import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
import './MarketingTable.scss';

const targetMapping = {
  orders: 'Everyone',
  new_customers: 'New customers only',
  subscribers: 'Deliveroo Plus',
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
    id: 'date',
    numeric: false,
    disablePadding: true,
    label: 'Date',
  },
  {
    id: 'branche',
    numeric: true,
    disablePadding: false,
    label: 'Branche',
  },
  {
    id: 'platform',
    numeric: true,
    disablePadding: false,
    label: 'Platfrom',
  },
  /*   {
    id: 'day',
    numeric: true,
    disablePadding: false,
    label: 'Day',
  },
  {
    id: 'slot',
    numeric: true,
    disablePadding: false,
    label: 'Slot',
  }, */
  {
    id: 'discountType',
    numeric: true,
    disablePadding: false,
    label: 'Discount Type',
  },
  {
    id: 'procent',
    numeric: true,
    disablePadding: false,
    label: '%',
  },
  {
    id: 'minOrder',
    numeric: true,
    disablePadding: false,
    label: 'Min Order',
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
  /*   {
    id: 'discountTypePr',
    numeric: true,
    disablePadding: false,
    label: 'Discount Type',
  }, */
  /* {
    id: 'targetPr',
    numeric: true,
    disablePadding: false,
    label: 'Target',
  },
     {
    id: 'statusPr',
    numeric: true,
    disablePadding: false,
    label: 'Status',
  },
  {
    id: 'carroussel',
    numeric: true,
    disablePadding: false,
    label: 'Caroussel Visibility',
  },
  {
    id: 'rank',
    numeric: true,
    disablePadding: false,
    label: 'Visibility Rank',
  }, */
  {
    id: 'orders',
    numeric: true,
    disablePadding: false,
    label: '#Orders',
  },
  {
    id: 'avgBasket',
    numeric: true,
    disablePadding: false,
    label: 'Avg Basket',
  },
  {
    id: 'roi',
    numeric: true,
    disablePadding: false,
    label: 'ROI',
  },
  {
    id: 'revenue',
    numeric: true,
    disablePadding: false,
    label: 'Revenue',
  },
];
const EnhancedTableHead = (props) => {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHeadKit className="marketing-thead">
      <TableRowKit className="marketing-table-top">
        {headCells.map((headCell) => (
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

const MarketingTable = ({ rows, selected, setSelected, offers }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('name');
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => <React.Fragment key={n.name}>{n.name}</React.Fragment>);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name, offerId) => {
    /*     const selectedIndex = selected.indexOf(name);
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

    setSelected(newSelected); */

    navigate(`/offer/detail/${offerId}`, {
      state: {
        offerDetail: offers.find((o) => o.offer_id === offerId),
        prevPath: location.pathname,
      },
    });
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;
  return (
    <BoxKit className="competition-box" sx={{ width: '100%' }}>
      <PaperKit className="competition-table-paper" sx={{ width: '100%', mb: 2 }}>
        <TableContainerKit id="markeitngContainer">
          <TableKit sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
            <EnhancedTableHead
              numSelected={!selected ? 0 : selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBodyKit>
              {stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
                const isItemSelected = isSelected(index);

                return (
                  <TableRowKit
                    key={row.id}
                    className={`marketing-table-top ${isItemSelected ? 'selected' : ''}`}
                    onClick={(event) => handleClick(event, index, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    selected={isItemSelected}>
                    <TableCellKit component="th" id="dateMn" scope="row">
                      {row.date}
                    </TableCellKit>
                    <TableCellKit>{row.branche}</TableCellKit>
                    <TableCellKit>
                      <img
                        className="competition-table-icon"
                        src={row.platform === 'deliveroo' ? deliveroo : talabat}
                        alt={row.platform}
                      />
                    </TableCellKit>
                    {/*  <TableCellKit>{row.day}</TableCellKit>
                    <TableCellKit>{row.slot}</TableCellKit> */}
                    <TableCellKit>{row.discountType}</TableCellKit>
                    <TableCellKit>
                      <span className="competition-table-alert">{row.procent}%</span>
                    </TableCellKit>
                    <TableCellKit>{row.minOrder}</TableCellKit>
                    <TableCellKit>{targetMapping[row.target] || row.target}</TableCellKit>
                    <TableCellKit>
                      <span className={`competition-status ${row.status}`}>{row.status}</span>
                    </TableCellKit>
                    {/*        <TableCellKit>{row.discountTypePr}</TableCellKit>
                    <TableCellKit>
                      <span className={`competition-status ${row.targetPr}`}>{row.targetPr}</span>
                    </TableCellKit>
                    <TableCellKit>{row.statusPr}</TableCellKit> */}
                    {/* <TableCellKit>{row.caroussel}</TableCellKit>
                    <TableCellKit>{row.rank}</TableCellKit> */}
                    <TableCellKit>{row.orders}</TableCellKit>
                    <TableCellKit>{row.avgBasket}</TableCellKit>
                    <TableCellKit>{row.roi}</TableCellKit>
                    <TableCellKit id="revenuePr">{row.revenue}</TableCellKit>
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

export default MarketingTable;
