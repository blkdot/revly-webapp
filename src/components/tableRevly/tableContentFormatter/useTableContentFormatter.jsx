import React, { useEffect, useState } from 'react';

import TableCellKit from '../../../kits/tablecell/TableCellKit';
import { platformObject } from '../../../data/platformList';
import TooltipKit from '../../../kits/toolTip/TooltipKit';

const useTableContentFormatter = () => {
  const renderSimpleRow = (r, h, i = 0) => (
    <TableCellKit
      id={`${h.id}_${i}`}
      key={`${h.id}}`}
      style={{ marginTop: '0.5rem', minWidth: '14rem', textAlign: 'center', cursor: 'pointer' }}
    >
      <span style={{ textAlign: 'justify' }} key={h.id}>
        {r[h.id] === null ? '-' : r[h.id]}
      </span>
    </TableCellKit>
  );

  const renderSimpleRowNotCentered = (r, h, i = 0) => (
    <TableCellKit
      id={`${h.id}_${i}`}
      key={`${h.id}_${r.id}`}
      style={{ marginTop: '0.5rem', minWidth: '14rem', textAlign: 'center' }}
    >
      <span style={{ textAlign: 'justify' }} key={h.id}>
        {r[h.id] === null ? '-' : r[h.id]}
      </span>
    </TableCellKit>
  );
  const compareSize = () => {
    const textElement = document.querySelectorAll('.render-row-tooltip');
    const compareArr = [];
    textElement.forEach((el) => {
      if (el?.scrollWidth > el.clientWidth) {
        compareArr.push(el.textContent);
      }
    });
    setHoverStatus(compareArr);
  };
  const root = document.querySelector('#root');
  useEffect(() => {
    compareSize();
    window.addEventListener('resize', compareSize);
  }, [root.ariaHidden]);

  useEffect(
    () => () => {
      window.removeEventListener('resize', compareSize);
    },
    [root.ariaHidden],
  );

  const [hoverStatus, setHoverStatus] = useState([]);
  const getHoverStatus = (name) => hoverStatus.find((n) => n === name);
  const renderRowTooltip = (r, h) => (
    <TableCellKit
      key={`${h.id}_${r.id}`}
      style={{ marginTop: '0.5rem', minWidth: '14rem', textAlign: 'center' }}
    >
      <TooltipKit
        id="category-tooltip"
        interactive={1}
        disableHoverListener={!getHoverStatus(r[h.id] === null ? '-' : r[h.id])}
        title={r[h.id] === null ? '-' : r[h.id] || ''}
      >
        <span onMouseEnter={compareSize} className="render-row-tooltip" key={h.id}>
          {r[h.id] === null ? '-' : r[h.id] || ''}
        </span>
      </TooltipKit>
    </TableCellKit>
  );

  const renderPlatform = (r, h, i = 0) => (
    <TableCellKit
      id={`${h.id}_${i}`}
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

  const renderPercent = (r, h, i = 0) => (
    <TableCellKit
      id={`${h.id}_${i}`}
      key={`${h.id}_${r.id}`}
      style={{ marginTop: '0.5rem', textAlign: 'center' }}
    >
      <span
        className={r[h.id] !== null ? 'competition-table-alert' : ''}
        style={{ whiteSpace: 'nowrap' }}
      >
        {r[h.id] === null ? '-' : `${r[h.id]}%`}
      </span>
    </TableCellKit>
  );

  const renderCurrency = (r, h, i = 0) => (
    <TableCellKit
      id={`${h.id}_${i}`}
      key={`${h.id}_${r.id}`}
      style={{ marginTop: '0.5rem', textAlign: 'center' }}
    >
      <span style={{ whiteSpace: 'nowrap' }}>{!r[h.id] ? '0' : r[h.id]}&nbsp;AED</span>
    </TableCellKit>
  );

  const renderCalculatedPercent = (r, h, i = 0) => (
    <TableCellKit
      id={`${h.id}_${i}`}
      key={`${h.id}_${r.id}`}
      style={{ marginTop: '0.5rem', textAlign: 'center' }}
    >
      <span className="competition-table-alert" style={{ whiteSpace: 'nowrap' }}>
        {r[h.id] * 100}%
      </span>
    </TableCellKit>
  );

  const renderStatus = (r, h, i = 0) => (
    <TableCellKit id={`${h.id}_${i}`} key={`${h.id}_${r.id}`} style={{ textAlign: 'center' }}>
      <span style={{ whiteSpace: 'nowrap' }} className={`competition-status ${r[h.id]}`}>
        {r[h.id] === 'Upcoming' ? 'Scheduled' : r[h.id]}
      </span>
    </TableCellKit>
  );

  const renderScheduleType = (r, h, i = 0) => {
    const scheduleTypeMapping = {
      once: 'Once',
      now: 'Now',
      workweek: 'Work week',
      everyday: 'Everyday',
    };
    return (
      <TableCellKit id={`${h.id}_${i}`} key={`${h.id}_${r.id}`} style={{ textAlign: 'center' }}>
        <span style={{ whiteSpace: 'nowrap' }} className={`competition-status ${r[h.id]}`}>
          {scheduleTypeMapping[r[h.id]] || r[h.id] || '-'}
        </span>
      </TableCellKit>
    );
  };

  const renderTarget = (r, h, i = 0) => {
    const targetMapping = {
      orders: 'Everyone',
      new_customers: 'New customers only',
      subscribers: 'Deliveroo Plus',
    };

    return (
      <TableCellKit id={`${h.id}_${i}`} key={`${h.id}_${r.id}`} style={{ textAlign: 'center' }}>
        <span style={{ whiteSpace: 'nowrap' }} className={`competition-status ${r[h.id]}`}>
          {targetMapping[r[h.id]] || r[h.id] || '-'}
        </span>
      </TableCellKit>
    );
  };

  const ordinalSuffixOf = (i) => {
    if (!i) return '-';
    const r = Math.round(i);
    return r >= 100 ? '100' : `${r}`;
  };

  const renderOrdinalSuffix = (r, h) => (
    <TableCellKit>
      {ordinalSuffixOf(r[h.id]) >= 100 && '> '}
      {ordinalSuffixOf(r[h.id])}
    </TableCellKit>
  );

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
    renderOrdinalSuffix,
    renderRowTooltip,
  };
};

export default useTableContentFormatter;
