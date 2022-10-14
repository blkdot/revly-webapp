import React, { useState } from 'react';
import { noCase, sentenceCase } from 'change-case';
import { useLocation, useNavigate } from 'react-router-dom';

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
import { ignoredFields, headCellsOffre, headCellsAds } from '../../data/planningOffers';
import { platformObject } from '../../data/platformList';

const columnLabel = {
  type_schedule: 'Schedule type',
  total_budget: 'Budget',
  cost_per_click: 'Bid',
};
const headCells = {
  offer: headCellsOffre,
  ad: headCellsAds,
};

const PlanningOffersTable = ({ rows, type }) => {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const navigate = useNavigate();
  const location = useLocation();
  // const [selected, setSelected] = useState([]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const getHeadCells = () => {
    if (!rows[0]) return headCells[type];
    return Object.keys(rows[0])
      .map((k) => ({
        key: k,
        id: k,
        numeric: Number.isNaN(rows[0][k]),
        disablePadding: true,
        label: columnLabel[k] ? columnLabel[k] : sentenceCase(noCase(k)),
      }))
      .filter((el) => !ignoredFields.includes(el.id));
  };

  const navigateToOfferDetails = (offer) =>
    navigate(`/offer/detail/${offer.offer_id}`, {
      state: { offerDetail: offer, prevPath: location.pathname },
    });

  const renderSimpleRow = (r, h) => (
    <TableCellKit
      id={h.id}
      key={`${h.id}_${r.id}`}
      style={{ marginTop: '0.5rem', minWidth: '14rem', textAlign: 'center', cursor: 'pointer' }}>
      <span style={{ textAlign: 'justify' }} key={h.id}>
        {r[h.id] === null ? '-' : r[h.id]}
      </span>
    </TableCellKit>
  );

  const renderSimpleRowNotCentered = (r, h) => (
    <TableCellKit
      id={h.id}
      key={`${h.id}_${r.id}`}
      style={{ marginTop: '0.5rem', minWidth: '14rem', textAlign: 'center' }}>
      <span style={{ textAlign: 'justify' }} key={h.id}>
        {r[h.id] === null ? '-' : r[h.id]}
      </span>
    </TableCellKit>
  );

  const renderPlatform = (r, h) => (
    <TableCellKit
      id={h.id}
      key={`${h.id}_${r.id}`}
      style={{ marginTop: '0.5rem', minWidth: '8rem', textAlign: 'center' }}>
      <img
        className="planning-platform"
        style={{ marginRight: '1.5rem' }}
        src={platformObject[r.platform].src}
        alt={platformObject[r.platform].name}
      />
    </TableCellKit>
  );

  const renderPercent = (r, h) => (
    <TableCellKit
      id={h.id}
      key={`${h.id}_${r.id}`}
      style={{ marginTop: '0.5rem', textAlign: 'center' }}>
      <span className="competition-table-alert" style={{ whiteSpace: 'nowrap' }}>
        {r[h.id]}%
      </span>
    </TableCellKit>
  );

  const renderCurrency = (r, h) => (
    <TableCellKit
      id={h.id}
      key={`${h.id}_${r.id}`}
      style={{ marginTop: '0.5rem', textAlign: 'center' }}>
      <span style={{ whiteSpace: 'nowrap' }}>{r[h.id]}&nbsp;AED</span>
    </TableCellKit>
  );

  const renderCalculatedPercent = (r, h) => (
    <TableCellKit
      id={h.id}
      key={`${h.id}_${r.id}`}
      style={{ marginTop: '0.5rem', textAlign: 'center' }}>
      <span className="competition-table-alert" style={{ whiteSpace: 'nowrap' }}>
        {r[h.id] * 10}%
      </span>
    </TableCellKit>
  );

  const renderStatus = (r, h) => (
    <TableCellKit id={h.id} key={`${h.id}_${r.id}`} style={{ textAlign: 'center' }}>
      <span style={{ whiteSpace: 'nowrap' }} className={`competition-status ${r[h.id]}`}>
        {r[h.id] === 'Upcoming' ? 'Scheduled' : r[h.id]}
      </span>
    </TableCellKit>
  );

  const renderScheduleType = (r, h) => {
    const scheduleTypeMapping = {
      once: 'Once',
      now: 'Now',
      workweek: 'Work week',
      everyday: 'Everyday',
    };
    return (
      <TableCellKit id={h.id} key={`${h.id}_${r.id}`} style={{ textAlign: 'center' }}>
        <span style={{ whiteSpace: 'nowrap' }} className={`competition-status ${r[h.id]}`}>
          {scheduleTypeMapping[r[h.id]] || r[h.id] || '-'}
        </span>
      </TableCellKit>
    );
  };

  const renderTarget = (r, h) => {
    const targetMapping = {
      orders: 'Everyone',
      new_customers: 'New customers only',
      subscribers: 'Deliveroo Plus',
    };
    return (
      <TableCellKit id={h.id} key={`${h.id}_${r.id}`} style={{ textAlign: 'center' }}>
        <span style={{ whiteSpace: 'nowrap' }} className={`competition-status ${r[h.id]}`}>
          {targetMapping[r[h.id]] || r[h.id] || '-'}
        </span>
      </TableCellKit>
    );
  };

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
    vendor_name: renderSimpleRowNotCentered,
    target: renderTarget,
    type_schedule: renderScheduleType,
  };

  const renderRowsByHeader = (r) =>
    getHeadCells().map((h) =>
      cellTemplatesObject[h.id] ? cellTemplatesObject[h.id](r, h) : renderSimpleRow(r, h),
    );

  const renderTableBody = () => {
    if (!rows || rows.length < 1)
      return (
        <TableCellKit colSpan={getHeadCells().length} style={{ textAlign: 'center' }}>
          <span>No data retrieved</span>
        </TableCellKit>
      );

    return stableSort(rows, getComparator(order, orderBy)).map((row) => (
      <TableRowKit
        onClick={() => navigateToOfferDetails(row)}
        className="offer-row"
        key={row.id}
        selected={false}
        style={{ marginTop: '0.5rem' }}>
        {renderRowsByHeader(row)}
      </TableRowKit>
    ));
  };

  return (
    <BoxKit className="planning-box" sx={{ width: '100%' }}>
      <PaperKit className="planning-box__paper" sx={{ width: '100%', mb: 2 }}>
        <TableContainerKit id="adsContainer" className="planning-table-container">
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
