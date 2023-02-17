import { BoxKit, TableCellKit, TableHeadKit, TableRowKit, TableSortLabelKit, TooltipKit } from 'kits';
import TooltipIcon from '../../assets/images/tooltip-ic.svg';

const EnhancedTableHead = (props: any) => {
  const { order, orderBy, onRequestSort, header } = props;

  const createSortHandler = (property) => () => {
    onRequestSort(property);
  };

  return (
    <TableHeadKit className='table_head'>
      <TableRowKit>
        {header.map((headCell) => (
          <TableCellKit
            key={headCell.id}
            align='left'
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            style={{ height: '42px', textTransform: 'capitalize' }}
            id={`${headCell.id}_header`}
          >
            <TableSortLabelKit
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              style={{ whiteSpace: 'nowrap', marginLeft: '1rem' }}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {
                headCell.tooltip ? <TooltipKit
                  interactive={1}
                  id='category-tooltip'
                  title={headCell.tooltip}
                >
                  <img className={`table-header-tooltip ${orderBy === headCell.id ? order : 'asc'}`} src={TooltipIcon} alt='tooltip icon' />
                </TooltipKit> : null
              }
              {orderBy === headCell.id ? (
                <BoxKit component='span' sx={{ display: 'none' }}>
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

export default EnhancedTableHead;
