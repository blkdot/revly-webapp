import { useAtom } from 'jotai';
import { TableCellKit, TooltipKit } from 'kits';
import arrow from '../../../assets/images/arrow.png';
import { platformList, platformObject } from '../../../data/platformList';
import { vendorsAtom } from '../../../store/vendorsAtom';

const useTableContentFormatter = () => {
  const [vendorsState] = useAtom(vendorsAtom);
  const { vendorsArr } = vendorsState;
  const renderSimpleRow = (r, h, i = 0) => (
    <TableCellKit
      id={`${h.id}_${i}`}
      key={`${h.id}}`}
      style={{ marginTop: '0.5rem', minWidth: '14rem', textAlign: 'center', cursor: 'pointer' }}
    >
      <span style={{ textAlign: 'justify' }} key={h.id}>
        {r[h.id] === null ? '-' : r[h.id]?.toLocaleString('en-US')}
      </span>
    </TableCellKit>
  );

  const renderIsoDate = (r, h, i = 0) => (
    <TableCellKit
      id={`${h.id}_${i}`}
      key={`${h.id}}`}
      style={{ marginTop: '0.5rem', minWidth: '14rem', textAlign: 'center', cursor: 'pointer' }}
    >
      <span style={{ textAlign: 'justify' }} key={h.id}>
        {r[h.id] === null ? '-' : r[h.id]?.replace('T', ' ')?.toLocaleString('en-US')}
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
        {r[h.id] === null ? '-' : r[h.id]?.toLocaleString('en-US')}
      </span>
    </TableCellKit>
  );

  const renderTimeSlot = (r, h, i = 0) => (
    <TableCellKit
      id={`${h.id}_${i}`}
      key={`${h.id}}`}
      style={{ marginTop: '0.5rem', minWidth: '14rem', textAlign: 'center', cursor: 'pointer' }}
    >
      <span style={{ textAlign: 'justify' }} key={h.id}>
        {`${r.start_hour} - ${r.end_hour}`}
      </span>
    </TableCellKit>
  );

  const renderRowTooltip = (r, h) => (
    <TableCellKit
      key={`${h.id}_${r.id}`}
      style={{ marginTop: '0.5rem', minWidth: '10rem', textAlign: 'center' }}
    >
      <TooltipKit
        title={
          r[h.id] === null || !r[h.id]
            ? '-'
            : r[h.id].map((vendor) => (
                <span key={vendor} className='render-row-tooltip column'>
                  {vendor}
                </span>
              ))
        }
        disableHoverListener={r[h.id]?.length === 0}
        id='category-tooltip'
        placement='right'
        arrow
      >
        <span className='render-row-tooltip' key={h.id}>
          {r[h.id] === null || !r[h.id] ? '-' : (r[h.id]?.length || 0)?.toLocaleString('en-US')}
        </span>
      </TooltipKit>
    </TableCellKit>
  );

  const renderVendorId = (r, h) => (
    <TableCellKit
      key={`${h.id}_${r.id}`}
      style={{ marginTop: '0.5rem', minWidth: '10rem', textAlign: 'center' }}
    >
      <TooltipKit
        title={
          r[h.id] === null || !r[h.id]
            ? '-'
            : r[h.id].map((vendor) => {
                const vendorData = vendorsArr.find((vObj) => vendor === vObj.vendor_id);
                return (
                  <span key={vendor} className='render-row-tooltip column'>
                    {vendorData.data.vendor_name || vendor}
                  </span>
                );
              })
        }
        disableHoverListener={r[h.id]?.length === 0}
        id='category-tooltip'
        placement='right'
        arrow
      >
        <span className='render-row-tooltip' key={h.id}>
          {r[h.id] === null || !r[h.id] ? '-' : (r[h.id]?.length || 0)?.toLocaleString('en-US')}
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
        className='planning-platform'
        style={{ marginRight: '1.5rem' }}
        src={platformObject[r.platform.toLowerCase()].src}
        alt={platformObject[r.platform.toLowerCase()].name}
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
      <span style={{ whiteSpace: 'nowrap' }}>
        {!r[h.id] ? '0' : r[h.id].toLocaleString('en-US')}&nbsp;AED
      </span>
    </TableCellKit>
  );

  const renderCalculatedPercent = (r, h, i = 0) => (
    <TableCellKit
      id={`${h.id}_${i}`}
      key={`${h.id}_${r.id}`}
      style={{ marginTop: '0.5rem', textAlign: 'center' }}
    >
      <span className='competition-table-alert' style={{ whiteSpace: 'nowrap' }}>
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
      {(ordinalSuffixOf(r[h.id]) as any) >= 100 && '> '}
      {ordinalSuffixOf(r[h.id])}
    </TableCellKit>
  );

  const renderBranchRow = (r, h, i = 0) => (
    <TableCellKit
      style={{ paddingLeft: 0, cursor: 'pointer' }}
      id={`${h.id}_${i}`}
      key={`${h.id}_${r.id}`}
    >
      {r[h.id].status === 'in process' ? (
        <span className='render-branch-row_skeleton' />
      ) : (
        <div
          className={`render-branch-row ${r[h.id].status === 'suspended' ? 'row-suspended' : ''}`}
        >
          <p className='__title'>{r[h.id].title}</p>
          <span className='__subtitle'>{r[h.id].address}</span>
        </div>
      )}
    </TableCellKit>
  );
  const renderLinkedPlatformsRow = (r, h, i = 0) => {
    const getPlatform = (plat) => platformList.find((obj) => obj.name === plat.toLowerCase());
    return (
      <TableCellKit
        style={{ paddingLeft: 0, cursor: 'pointer' }}
        id={`${h.id}_${i}`}
        key={`${h.id}_${r.id}`}
      >
        {r[h.id].map((obj) => (
          <span
            key={obj.platform.toLowerCase()}
            style={{ '--color': getPlatform(obj.platform).color } as any}
            className={`render-linked-platforms-row ${
              obj.status === 'in process' ? 'process' : ''
            } ${obj.status === 'active' ? 'active' : ''} ${
              r.branchStatus === 'suspended' ? 'row-suspended' : ''
            }`}
          >
            <img
              src={
                getPlatform(obj.platform.toLowerCase()).srcFaviconWhite ||
                getPlatform(obj.platform.toLowerCase()).srcFavicon
              }
              alt={obj.platform.toLowerCase()}
            />
          </span>
        ))}
      </TableCellKit>
    );
  };
  const renderAccountsRow = (r, h, i = 0) => (
    <TableCellKit
      style={{ paddingLeft: 0, textAlign: 'left', cursor: 'pointer' }}
      id={`${h.id}_${i}`}
      key={`${h.id}_${r.id}`}
    >
      <div
        className={`render-accounts-row ${r[h.id].status === 'suspended' ? 'row-suspended' : ''}`}
      >
        {r[h.id] && r[h.id].length > 1 ? `${r[h.id][0]} + ${r[h.id].length - 1} more` : r[h.id][0]}
      </div>
    </TableCellKit>
  );
  const renderBranchStatusRow = (r, h, i = 0) => (
    <TableCellKit
      style={{ paddingLeft: 0, textAlign: 'left', cursor: 'pointer' }}
      id={`${h.id}_${i}`}
      key={`${h.id}_${r.id}`}
    >
      <div className='render-branch_status-row_wrapper'>
        <div className={`render-branch_status-row ${r[h.id].replace(/\s/g, '')}`}>{r[h.id]}</div>
        {r[h.id] !== 'in process' ? <img className='arrow' src={arrow} alt='arrow' /> : ''}
      </div>
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
    renderBranchRow,
    renderLinkedPlatformsRow,
    renderAccountsRow,
    renderBranchStatusRow,
    renderVendorId,
    renderTimeSlot,
    renderIsoDate,
  };
};

export default useTableContentFormatter;
