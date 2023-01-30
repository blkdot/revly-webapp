import { platformList } from '../../data/platformList';
import BoxKit from '../../kits/box/BoxKit';
import PaperKit from '../../kits/paper/PaperKit';
import SkeletonKit from '../../kits/skeleton/SkeletonKit';
import TableKit from '../../kits/table/TableKit';
import TableBodyKit from '../../kits/tablebody/TableBodyKit';
import TableCellKit from '../../kits/tablecell/TableCellKit';
import TableContainerKit from '../../kits/tablecontainer/TableContainerKit';
import TableHeadKit from '../../kits/tablehead/TableHeadKit';
import TableRowKit from '../../kits/tablerow/TableRowKit';
import TableSortLabelKit from '../../kits/tablesortlabel/TableSortLableKit';
import './Table.scss';

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
    label: '',
  },
  {
    id: 'week1',
    numeric: true,
    disablePadding: false,
    label: '',
  },
  {
    id: 'evolution',
    numeric: true,
    disablePadding: false,
    label: 'Evolution',
  },
];

const EnhancedTableHead = () => (
  <TableHeadKit className='table-head'>
    <TableRowKit>
      {headCells.map((headCell) => (
        <TableCellKit className='enchanced-table-cell' key={headCell.id}>
          <TableSortLabelKit direction='asc'>
            <SkeletonKit variant='rectangular' width={100} />
          </TableSortLabelKit>
        </TableCellKit>
      ))}
    </TableRowKit>
  </TableHeadKit>
);

const renderRow = () =>
  platformList.map((row) => (
    <TableRowKit key={row.name} className='table-row'>
      <TableCellKit component='th' id={row.name} scope='row'>
        <img
          className={`table-img ${row.name === 'deliveroo' ? 'img-del' : ''}`}
          src={row.src}
          alt={row.name}
        />
      </TableCellKit>
      <TableCellKit>
        <SkeletonKit variant='rectangular' width={100} />
      </TableCellKit>
      <TableCellKit>
        <SkeletonKit variant='rectangular' width={100} />
      </TableCellKit>
      <TableCellKit>
        <span>
          <SkeletonKit variant='rectangular' width={100} />
        </span>
      </TableCellKit>
    </TableRowKit>
  ));

const TableEmpty = () => (
  <BoxKit sx={{ width: '100%' }}>
    <PaperKit className='table-paper-wrapper'>
      <TableContainerKit>
        <TableKit className='table' aria-labelledby='tableTitle' size='medium'>
          <EnhancedTableHead />
          <TableBodyKit className='table-body'>{renderRow()}</TableBodyKit>
          <TableHeadKit>
            <TableRowKit className='table-row table-total'>
              <TableCellKit component='th' scope='row'>
                Total
              </TableCellKit>
              <TableCellKit>
                <SkeletonKit variant='rectangular' width={100} />
              </TableCellKit>
              <TableCellKit>
                <SkeletonKit variant='rectangular' width={100} />
              </TableCellKit>
              <TableCellKit>
                <span>
                  <SkeletonKit variant='rectangular' width={100} />
                </span>
              </TableCellKit>
            </TableRowKit>
          </TableHeadKit>
        </TableKit>
      </TableContainerKit>
    </PaperKit>
  </BoxKit>
);

export default TableEmpty;
