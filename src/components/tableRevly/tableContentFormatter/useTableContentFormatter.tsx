import { CSSProperties } from 'react';
import { useAtom } from 'jotai';
import { parseISO, format } from 'date-fns';
import { SkeletonKit, TableCellKit, TextfieldKit, TooltipKit } from 'kits';
import shortid from 'shortid';
import { vendorsAtom } from 'store/vendorsAtom';
import { useVendors } from 'hooks';
import costAtom from 'store/costAtom';
import { platformList, platformObject } from '../../../data/platformList';
import Calendar from '../../../assets/images/calendar.svg';
import Clock from '../../../assets/images/clock.svg';
import User from '../../../assets/images/user.svg';
import ShoppingBag from '../../../assets/images/shopping-bag.svg';
import Graph from '../../../assets/images/graph.svg';
import Eye from '../../../assets/images/eye.svg';
import Smile from '../../../assets/images/smile.svg';

const useTableContentFormatter = () => {
  const { getChainData } = useVendors();
  const [vendorsState] = useAtom(vendorsAtom);
  const { chainData } = vendorsState;
  const Images = {
    start_end_date: Calendar,
    slot: Clock,
    goal: User,
    orders: ShoppingBag,
    clicks: Graph,
    impressions: Eye,
    customers: Smile,
  };
  const renderSimpleRow = (r, h, i = 0) => (
    <TableCellKit
      id={`${h.id}_${i}`}
      key={h.id}
      style={{ marginTop: '0.5rem', minWidth: '14rem', textAlign: 'left', cursor: 'pointer' }}
    >
      <span className='table-text' style={{ textAlign: 'justify' }} key={h.id}>
        {r[h.id] === null ? '-' : r[h.id]?.toLocaleString('en-US')}
      </span>
    </TableCellKit>
  );

  const renderSimpleIconRow = (r, h, i = 0) => (
    <TableCellKit
      id={`${h.id}_${i}`}
      key={h.id}
      style={{ marginTop: '0.5rem', minWidth: '14rem', textAlign: 'center', cursor: 'pointer' }}
    >
      <span className='icon-row' style={{ textAlign: 'justify' }} key={h.id}>
        {r[h.id] === null ? '' : <img src={Images[h.id]} alt={r[h.id]} />}
        {r[h.id] === null ? '-' : r[h.id]?.toLocaleString('en-US')}
      </span>
    </TableCellKit>
  );

  const renderOfferIds = (r, h, i = 0) => (
    <TableCellKit
      id={`${h.id}_${i}`}
      key={h.id}
      style={{ marginTop: '0.5rem', minWidth: '14rem', textAlign: 'center', cursor: 'pointer' }}
    >
      <span style={{ textAlign: 'justify' }} key={h.id}>
        {r.offer_ids.join('')}
      </span>
    </TableCellKit>
  );

  const renderAdIds = (r, h, i = 0) => (
    <TableCellKit
      id={`${h.id}_${i}`}
      key={h.id}
      style={{ marginTop: '0.5rem', minWidth: '14rem', textAlign: 'center', cursor: 'pointer' }}
    >
      <span style={{ textAlign: 'justify' }} key={h.id}>
        {r.ad_ids.join('')}
      </span>
    </TableCellKit>
  );

  const renderIsoDate = (r, h, i = 0) => (
    <TableCellKit
      id={`${h.id}_${i}`}
      key={`${h.id}_${r.id}`}
      style={{ marginTop: '0.5rem', minWidth: '14rem', textAlign: 'center', cursor: 'pointer' }}
    >
      <span style={{ textAlign: 'justify' }}>
        {r[h.id] === null ? '-' : <>{format(parseISO(r[h.id]), 'Y-MM-dd')}</>}
      </span>
    </TableCellKit>
  );

  const renderIsoDateOnly = (r, h, i = 0) => (
    <TableCellKit
      id={`${h.id}_${i}`}
      key={`${h.id}_${r.id}`}
      style={{ marginTop: '0.5rem', minWidth: '14rem', textAlign: 'center', cursor: 'pointer' }}
    >
      <span style={{ textAlign: 'justify' }}>
        {r[h.id] === null ? '-' : <>{format(parseISO(r[h.id]), 'Y-MM-dd')}</>}
      </span>
    </TableCellKit>
  );

  const stepsMinute = 1000 * 60 * 30;

  const renderIsoStartTimeOnlyFromDate = (r) => (
    <TableCellKit
      key={`start_hour_${r.id}`}
      style={{ marginTop: '0.5rem', minWidth: '14rem', textAlign: 'center', cursor: 'pointer' }}
    >
      <span style={{ textAlign: 'justify' }}>
        {r.start_date === null ? (
          '-'
        ) : (
          <>
            {format(
              Math.round(parseISO(r.start_date).getTime() / stepsMinute) * stepsMinute,
              'HH:mm'
            )}
          </>
        )}
      </span>
    </TableCellKit>
  );

  const renderIsoEndTimeOnlyFromDate = (r) => (
    <TableCellKit
      key={`end_hour_${r.id}`}
      style={{ marginTop: '0.5rem', minWidth: '14rem', textAlign: 'center', cursor: 'pointer' }}
    >
      <span style={{ textAlign: 'justify' }}>
        {r.end_date === null ? (
          '-'
        ) : (
          <>
            {format(
              Math.round(parseISO(r.end_date).getTime() / stepsMinute) * stepsMinute,
              'HH:mm'
            )}
          </>
        )}
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
      key={`${h.id}_${r.id}`}
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
                <span key={`${vendor}${shortid.generate()}`} className='render-row-tooltip column'>
                  {vendor}
                </span>
              ))
        }
        disableHoverListener={r[h.id]?.length === 0}
        id='category-tooltip'
        placement='right-start'
        arrow
      >
        <span className='render-row-tooltip' key={h.id}>
          {r[h.id] === null || !r[h.id] ? '-' : (r[h.id]?.length || 0)?.toLocaleString('en-US')}
        </span>
      </TooltipKit>
    </TableCellKit>
  );

  const renderVendorId = (r, h) => {
    const vendors = r[h.id].map((vendor) => {
      const vendorData = chainData.find((objV) => String(objV.vendor_id) === String(vendor))

      if (!vendorData) return null;

      return vendorData.vendor_name || vendor;
    });
    return (
      <TableCellKit
        key={`${h.id}_${r.id}`}
        style={{ marginTop: '0.5rem', minWidth: '10rem', textAlign: 'left' }}
      >
        {vendors.length === 1 ? (
          <span className='render-vendor-text' key={h.id}>
            {vendors[0]}
          </span>
        ) : (
          <TooltipKit
            title={
              r[h.id] === null || !r[h.id]
                ? '-'
                : vendors.map((vendor) => (
                    <span
                      key={`${vendor}${shortid.generate()}`}
                      className='render-row-tooltip column'
                    >
                      {vendor}
                    </span>
                  ))
            }
            disableHoverListener={r[h.id]?.length === 0}
            id='category-tooltip'
            placement='right-start'
            arrow
          >
            <span className='render-row-tooltip' key={h.id}>
              {r[h.id] === null || !r[h.id] ? '-' : (r[h.id]?.length || 0)?.toLocaleString('en-US')}
            </span>
          </TooltipKit>
        )}
      </TableCellKit>
    );
  };

  const renderChainId = (r, h, i) => {
    const vendorData = getChainData(r.chain_id, r.vendor_ids);

    return (
      <TableCellKit
        id={`${h.id}_${i}`}
        key={`${h.id}_${r.id}`}
        style={{ marginTop: '0.5rem', minWidth: '14rem', textAlign: 'left' }}
      >
        <span style={{ textAlign: 'justify' }} key={h.id}>
          {vendorData.chain_name}
        </span>
      </TableCellKit>
    );
  };

  const renderPlatform = (r, h, i = 0) => (
    <TableCellKit
      id={`${h.id}_${i}`}
      key={`${h.id}_${r.id}`}
      style={{ marginTop: '0.5rem', minWidth: '8rem', textAlign: 'left' }}
    >
      {platformObject[r[h.id].toLowerCase()] ? (
        <img
          className='planning-platform'
          style={
            {
              '--color': platformObject[r[h.id].toLowerCase()].color,
            } as CSSProperties
          }
          src={
            platformObject[r[h.id].toLowerCase()].srcFaviconWhite ||
            platformObject[r[h.id].toLowerCase()].srcFavicon
          }
          alt={platformObject[r[h.id].toLowerCase()].name}
        />
      ) : (
        <span className='table-text'>{r[h.id]}</span>
      )}
    </TableCellKit>
  );

  const renderPercent = (r, h, i = 0) => (
    <TableCellKit
      id={`${h.id}_${i}`}
      key={`${h.id}_${r.id}`}
      style={{ marginTop: '0.5rem', textAlign: 'left' }}
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
      style={{ marginTop: '0.5rem', textAlign: 'left' }}
    >
      <span style={{ whiteSpace: 'nowrap' }}>
        {!r[h.id] ? '-' : `${r[h.id].toLocaleString('en-US')} AED`}
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
        {parseFloat((r[h.id] * 100).toFixed(2))}%
      </span>
    </TableCellKit>
  );

  const renderStatus = (r, h, i = 0) => {
    const render = () => {
      if (r[h.id] === 'Upcoming') {
        return 'Scheduled';
      }
      if (r[h.id] === 'Enabled') {
        return 'Live';
      }
      return r[h.id];
    };
    return (
      <TableCellKit id={`${h.id}_${i}`} key={`${h.id}_${r.id}`} style={{ textAlign: 'left' }}>
        <span
          style={{ whiteSpace: 'nowrap' }}
          className={`competition-status ${render().replace(/\s/g, '')}`}
        >
          {render()}
        </span>
      </TableCellKit>
    );
  };

  const renderScheduleType = (r, h, i = 0) => {
    const scheduleTypeMapping = {
      once: 'Once',
      now: 'Now',
      workweek: 'Work week',
      everyday: 'Everyday',
    };
    return (
      <TableCellKit id={`${h.id}_${i}`} key={`${h.id}_${r.id}`} style={{ textAlign: 'left' }}>
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
      <TableCellKit id={`${h.id}_${i}`} key={`${h.id}_${r.id}`} style={{ textAlign: 'left' }}>
        <span className='icon-row' style={{ whiteSpace: 'nowrap' }}>
          {r[h.id] === null ? '' : <img src={r[h.id].src} alt={r[h.id].title} />}
          {r[h.id] === null ? '-' : targetMapping[r[h.id.title]] || r[h.id].title}
        </span>
      </TableCellKit>
    );
  };

  const ordinalSuffixOf = (i: number): string => {
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

  const renderOrdinalSuffixV3 = (r, h) => (
    <TableCellKit>
      {Number(ordinalSuffixOf(r[h.id]?.average_vertical_rank)) >= 100 && '> '}
      {ordinalSuffixOf(r[h.id]?.average_vertical_rank)}
    </TableCellKit>
  );

  const renderBranchRow = (r, h, i = 0) => (
    <TableCellKit
      style={{ paddingLeft: 0, cursor: 'pointer' }}
      id={`${h.id}_${i}`}
      key={`${h.id}_${r.id}`}
    >
      <div className={`render-branch-row ${r.branch_status.replace(/\s/g, '')}`}>
        <p className='__title'>{r[h.id].title}</p>
        <span className='__subtitle'>{r[h.id].address}</span>
      </div>
    </TableCellKit>
  );
  const renderLinkedPlatformsRow = (r, h, i = 0) => {
    const getPlatform = (plat: string) =>
      platformList.find((obj) => obj.name.toLowerCase() === plat.toLowerCase());
    const sortPlatform = (a: any, b: any) => {
      if (b.platform < a.platform) {
        return -1;
      }
      if (b.platform > a.platform) {
        return 1;
      }
      return 0;
    };
    return (
      <TableCellKit
        style={{ paddingLeft: 0, cursor: 'pointer', textAlign: 'left' }}
        id={`${h.id}_${i}`}
        key={`${h.id}_${r.id}`}
      >
        {r[h.id].sort(sortPlatform).map((obj) => (
          <span
            key={obj.platform.toLowerCase()}
            style={{ '--color': getPlatform(obj.platform).color } as any}
            className={`render-linked-platforms-row ${obj.status.replace(
              /\s/g,
              ''
            )} row-${r.branch_status.replace(/\s/g, '')}`}
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
      <div className={`render-accounts-row ${r.branch_status.replace(/\s/g, '')}`}>
        {r[h.id] && r[h.id].length > 1 ? `${r[h.id][0]} + ${r[h.id].length - 1} more` : r[h.id][0]}
      </div>
    </TableCellKit>
  );
  const [cost, setCost] = useAtom(costAtom);

  const renderCostRow = (r, h, i = 0) => {
    const handleChange = (e) => {
      const finded = cost.find((obj) => obj.chain_name === r.chain_name);
      finded.cost = Number(e.target.value);
      finded.changed = true;
      setCost([...cost]);
    };
    return (
      <TableCellKit
        style={{ paddingLeft: 0, textAlign: 'left' }}
        id={`${h.id}_${i}`}
        key={`${h.id}_${r.id}`}
      >
        <TextfieldKit
          sx={{ width: '100%' }}
          type='number'
          defaultValue={r[h.id]}
          onChange={handleChange}
        />
      </TableCellKit>
    );
  };

  // row skeleton

  const renderSimpleRowSkeleton = (h, i = 0) => (
    <TableCellKit
      id={`${h.id}_${i}`}
      key={h.id}
      style={{ marginTop: '0.5rem', minWidth: '14rem', textAlign: 'left', cursor: 'pointer' }}
    >
      <SkeletonKit width='50%' height={14} />
    </TableCellKit>
  );
  const renderPlatformSkeleton = (h, i = 0) => (
    <TableCellKit
      id={`${h.id}_${i}`}
      key={h.id}
      style={{ marginTop: '0.5rem', minWidth: '8rem', textAlign: 'left' }}
    >
      <SkeletonKit variant='circular' width={22} height={22} />
    </TableCellKit>
  );
  const renderPercentSkeleton = (h, i = 0) => (
    <TableCellKit id={`${h.id}_${i}`} key={h.id} style={{ marginTop: '0.5rem', textAlign: 'left' }}>
      <SkeletonKit height={22} width={48} />
    </TableCellKit>
  );
  return {
    renderCostRow,
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
    renderVendorId,
    renderTimeSlot,
    renderIsoDate,
    renderIsoDateOnly,
    renderIsoStartTimeOnlyFromDate,
    renderIsoEndTimeOnlyFromDate,
    renderChainId,
    renderSimpleIconRow,
    renderOfferIds,
    renderAdIds,
    renderPlatformSkeleton,
    renderSimpleRowSkeleton,
    renderPercentSkeleton,
    renderOrdinalSuffixV3,
  };
};

export default useTableContentFormatter;
