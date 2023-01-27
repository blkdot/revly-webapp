import BoxKit from '../../kits/box/BoxKit';
import TableCellKit from '../../kits/tablecell/TableCellKit';
import TableHeadKit from '../../kits/tablehead/TableHeadKit';
import TableRowKit from '../../kits/tablerow/TableRowKit';
import TableSortLabelKit from '../../kits/tablesortlabel/TableSortLableKit';

const EnhancedTableHead = (props: any) => {
  const { order, orderBy, onRequestSort, header } = props;

  const createSortHandler = (property) => () => {
    onRequestSort(property);
  };

  return (
    <TableHeadKit>
      <TableRowKit>
        {header.map((headCell) => (
          <TableCellKit
            key={headCell.id}
            align="center"
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            style={{ height: '4rem' }}
            id={`${headCell.id}_header`}
          >
            <TableSortLabelKit
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              style={{ whiteSpace: 'nowrap', marginLeft: '1rem' }}
              onClick={createSortHandler(headCell.id)}
            >
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

export default EnhancedTableHead;
