import React, { useState } from 'react';
import { noCase, sentenceCase } from 'change-case';

import './PlanningOffersTable.scss';

import TableRowKit from '../../kits/tablerow/TableRowKit';
import TableCellKit from '../../kits/tablecell/TableCellKit';
import BoxKit from '../../kits/box/BoxKit';
import PaperKit from '../../kits/paper/PaperKit';
import TableContainerKit from '../../kits/tablecontainer/TableContainerKit';
import TableKit from '../../kits/table/TableKit';
import TableBodyKit from '../../kits/tablebody/TableBodyKit';
import EnhancedTableHead from '../enhancedTableHead/EnhancedTableHead';
import { getComparator, stableSort } from '../../utlls/scripts/scripts';
import { ignoredFields, headCells } from '../../data/planningOffers';
import { platformObject } from '../../data/platformList';

const PlanningOffersTable = ({ rows }) => {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  // const [selected, setSelected] = useState([]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const getHeadCells = () => {
    if (!rows[0]) return headCells;

    return Object.keys(rows[0])
      .map((k) => ({
        key: k,
        id: k,
        numeric: Number.isNaN(rows[0][k]),
        disablePadding: true,
        label: sentenceCase(noCase(k)),
      }))
      .filter((el) => !ignoredFields.includes(el.id));
  };

  const renderSimpleRow = (r, h) => (
    <span style={{ whiteSpace: 'nowrap' }} key={h.id}>
      {r[h.id] === null ? '-' : r[h.id]}
    </span>
  );

  const renderPlatform = (r) => (
    <img
      className="planning-platform"
      src={platformObject[r.platform].src}
      alt={platformObject[r.platform].name}
    />
  );

  const renderPercent = (r, h) => (
    <span className="competition-table-alert" style={{ whiteSpace: 'nowrap' }}>
      {r[h.id]}%
    </span>
  );

  const renderCurrency = (r, h) => <span style={{ whiteSpace: 'nowrap' }}>{r[h.id]}&nbsp;AED</span>;

  const renderCalculatedPercent = (r, h) => (
    <span className="competition-table-alert" style={{ whiteSpace: 'nowrap' }}>
      {r[h.id] * 10}%
    </span>
  );

  const renderStatus = (r, h) => (
    <span style={{ whiteSpace: 'nowrap' }} className={`competition-status ${r[h.id]}`}>
      {r[h.id]}
    </span>
  );

  const cellTemplatesObject = {
    platform: renderPlatform,
    discount_rate: renderPercent,
    minimum_order_value: renderCurrency,
    total_budget: renderCurrency,
    cost_per_click: renderCurrency,
    remaining_budget: renderCurrency,
    return_on_ad_spent: renderCurrency,
    spend: renderCurrency,
    status: renderStatus,
    ad_status: renderStatus,
    conversion_rate: renderCalculatedPercent,
  };

  const renderRowsByHeader = (r) =>
    getHeadCells().map((h) => (
      <TableCellKit key={`${h.id}_${r.id}`} style={{ marginTop: '0.5rem' }}>
        {cellTemplatesObject[h.id] ? cellTemplatesObject[h.id](r, h) : renderSimpleRow(r, h)}
      </TableCellKit>
    ));

  const renderTableBody = () => {
    // TODO: show message : no offers retrieved
    if (!rows || rows.length < 1)
      return (
        <TableCellKit colSpan={getHeadCells().length} style={{ textAlign: 'center' }}>
          <span>No data retrieved</span>
        </TableCellKit>
      );

    return stableSort(rows, getComparator(order, orderBy)).map((row) => (
      <TableRowKit key={row.id} selected={false} style={{ marginTop: '0.5rem' }}>
        {renderRowsByHeader(row)}
      </TableRowKit>
    ));
  };

  return (
    <BoxKit className="planning-box" sx={{ width: '100%' }}>
      <PaperKit className="planning-box__paper" sx={{ width: '100%', mb: 2 }}>
        <TableContainerKit className="planning-table-container">
          <TableKit aria-labelledby="tableTitle" size="medium">
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              header={getHeadCells()}
            />
            <TableBodyKit>{renderTableBody()}</TableBodyKit>
          </TableKit>
        </TableContainerKit>
      </PaperKit>
    </BoxKit>
  );
};

export default PlanningOffersTable;
