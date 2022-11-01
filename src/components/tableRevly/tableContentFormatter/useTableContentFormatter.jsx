import React from 'react';

import TableCellKit from '../../../kits/tablecell/TableCellKit';
import { platformObject } from '../../../data/platformList';

const useTableContentFormatter = () => {
  const renderSimpleRow = (r, h) => (
    <TableCellKit
      id={h.id}
      key={`${h.id}_${r.id}`}
      style={{ marginTop: '0.5rem', minWidth: '14rem', textAlign: 'center', cursor: 'pointer' }}
    >
      <span style={{ textAlign: 'justify' }} key={h.id}>
        {!r[h.id] ? '-' : r[h.id]}
      </span>
    </TableCellKit>
  );

  const renderSimpleRowNotCentered = (r, h) => (
    <TableCellKit
      id={h.id}
      key={`${h.id}_${r.id}`}
      style={{ marginTop: '0.5rem', minWidth: '14rem', textAlign: 'center' }}
    >
      <span style={{ textAlign: 'justify' }} key={h.id}>
        {r[h.id] === null ? '-' : r[h.id]}
      </span>
    </TableCellKit>
  );

  const renderPlatform = (r, h) => (
    <TableCellKit
      id={h.id}
      key={`${h.id}_${r.id}`}
      style={{ marginTop: '0.5rem', minWidth: '8rem', textAlign: 'center' }}
    >
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
      style={{ marginTop: '0.5rem', textAlign: 'center' }}
    >
      <span className="competition-table-alert" style={{ whiteSpace: 'nowrap' }}>
        {r[h.id]}%
      </span>
    </TableCellKit>
  );

  const renderCurrency = (r, h) => (
    <TableCellKit
      id={h.id}
      key={`${h.id}_${r.id}`}
      style={{ marginTop: '0.5rem', textAlign: 'center' }}
    >
      <span style={{ whiteSpace: 'nowrap' }}>{!r[h.id] ? '0' : r[h.id]}&nbsp;AED</span>
    </TableCellKit>
  );

  const renderCalculatedPercent = (r, h) => (
    <TableCellKit
      id={h.id}
      key={`${h.id}_${r.id}`}
      style={{ marginTop: '0.5rem', textAlign: 'center' }}
    >
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

  return {
    renderTarget,
    renderScheduleType,
    renderStatus,
    renderCalculatedPercent,
    renderCurrency,
    renderPercent,
    renderPlatform,
    renderSimpleRowNotCentered,
    renderSimpleRow,
  };
};

export default useTableContentFormatter;
