import {
  BoxKit,
  PaperKit,
  SkeletonKit,
  TableBodyKit,
  TableCellKit,
  TableContainerKit,
  TableKit,
  TableRowKit,
  TypographyKit,
} from 'kits';
import { useState, FC, useEffect } from 'react';
import { platformObject } from 'data/platformList';
import { Switch } from 'assets/icons';
import Arrow from '../../assets/images/arrow.svg';
import { getComparator, stableSort } from '../../utlls/scripts/scripts';
import EnhancedTableHead from '../enhancedTableHead/EnhancedTableHead';
import './TableRevly.scss';
import noData from '../../assets/images/no-result.svg';
import FilterDropdown from '../filter/filterDropdown/FilterDropdown';
// import Clock from '../../assets/images/clock.svg';
import Columns from '../../assets/images/columns.svg';

const TableRevlyNew: FC<{
  headers: any;
  rows: any;
  isLoading?: any;
  mainFieldOrdered?: any;
  onClickRow?: any;
  noEmptyMessage?: any;
  renderCustomSkelton?: any;
  links?: any;
  setLink?: any;
  link?: any;
  setOpenedFilter?: any;
  className?: string;
  filters?: any;
  filtersHead?: any;
  handleChangeMultipleFilter?: any;
  noDataText?: string,
}> = ({
  headers,
  rows,
  isLoading,
  mainFieldOrdered,
  onClickRow,
  noEmptyMessage,
  renderCustomSkelton,
  links,
  setLink,
  link,
  setOpenedFilter,
  className,
  filters,
  filtersHead,
  handleChangeMultipleFilter,
  noDataText,
}) => {
  const [order, setOrder] = useState('asc');
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
      if (noEmptyMessage) {
        return null;
      }

      return (
        <TableRowKit className='no-data'>
          <TableCellKit colSpan={7} style={{ textAlign: 'center' }}>
            <img src={noData} alt='no-data' />
            <p>{noDataText || 'Files not found description here'}</p>
          </TableCellKit>
        </TableRowKit>
      );
    }

    return renderRowsContent();
  };

  const getActiveLinkWidth = (index: number, type: string) => {
    const tableLink = document.querySelectorAll('.table-link')[index] as HTMLElement;
    if (type === 'scroll') {
      return tableLink.offsetLeft - tableLink.scrollLeft;
    }
    return tableLink?.clientWidth;
  };

  const changeLink = (name: string, index: number) => {
    setLink(name);
    const tableLinks = document.querySelector('.table-links') as HTMLElement;
    tableLinks?.style.setProperty('--length', `${getActiveLinkWidth(index, 'width')}px`);
    tableLinks?.style.setProperty('--left', `${getActiveLinkWidth(index, 'scroll')}px`);
  };
  useEffect(() => {
    const tableLinks = document.querySelector('.table-links') as HTMLElement;
    tableLinks?.style.setProperty('--length', `${getActiveLinkWidth(0, 'width')}px`);
    tableLinks?.style.setProperty('--left', `${getActiveLinkWidth(0, 'scroll')}px`);
  }, []);
  const renderTop = () => {
    if (links) {
      return (
        <div className='table-paper-top'>
          <div style={{ display: 'flex' }}>
            <BoxKit className='table-links'>
              {links.map((obj: {title: string, link: string}, index: number) => (
                <TypographyKit
                  key={obj.link}
                  className={`table-link ${link === obj.link ? 'active' : ''}`}
                  onClick={() => changeLink(obj.link, index)}
                >
                  {obj.title}
                </TypographyKit>
              ))}
            </BoxKit>
            <BoxKit className='table-arrow-links'>
              <img
                tabIndex={-1}
                role='presentation'
                className={links.findIndex((obj: { title: string, link: string }) => link === obj.link) > 0 ? 'active' : ''}
                onClick={() =>
                  changeLink(
                    links[links.findIndex((obj: { title: string, link: string }) => link === obj.link) - 1].link,
                    links.findIndex((obj: { title: string, link: string }) => link === obj.link) - 1
                  )
                }
                src={Arrow}
                alt='left-arrow'
              />
              <img
                tabIndex={-1}
                role='presentation'
                className={links.findIndex((obj: { title: string, link: string }) => link === obj.link) < links.length - 1 ? 'active' : ''}
                onClick={() =>
                  changeLink(
                    links[links.findIndex((obj: { title: string, link: string }) => link === obj.link) + 1].link,
                    links.findIndex((obj: { title: string, link: string }) => link === obj.link) + 1
                  )
                }
                src={Arrow}
                alt='right-arrow'
              />
            </BoxKit>
          </div>
          {filters ? (
            <BoxKit onClick={() => setOpenedFilter(true)} className='table-filter'>
              <span />
              <p>Filters</p>
            </BoxKit>
          ) : (
            ''
          )}
        </div>
      );
    }
    return '';
  };
  const renderFilters = () => {
    if (filters) {
      return (
        <div className='table-filters'>
          <FilterDropdown
            items={filtersHead.platform}
            values={filters.platform}
            onChange={handleChangeMultipleFilter('platform')}
            label='Platforms'
            icon={<img src={Columns} alt='Clock' />}
            internalIconOnActive={platformObject}
            maxShowned={1}
          />
          <FilterDropdown
            items={filtersHead.status}
            values={filters.status}
            onChange={handleChangeMultipleFilter('status')}
            label='Statuses'
            icon={<Switch />}
            maxShowned={1}
          />
        </div>
      );
    }
    return '';
  };
  return (
    <BoxKit className={`competition-box ${className || ''}`} sx={{ width: '100%' }}>
      <PaperKit className='table-paper' sx={{ width: '100%', mb: 2 }}>
        {renderTop()}
        {renderFilters()}
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
        </TableContainerKit>
      </PaperKit>
    </BoxKit>
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
  filtersHead: null,
  handleChangeMultipleFilter: null,
  noDataText: '',
};

export default TableRevlyNew;
