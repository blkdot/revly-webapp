// TODO: fix all linter problem
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import './Table.scss';

import { format, getYear } from 'date-fns';
import { enUS } from 'date-fns/locale';
import dayjs from 'dayjs';
import BoxKit from '../../kits/box/BoxKit';
import PaperKit from '../../kits/paper/PaperKit';
import TableHeadKit from '../../kits/tablehead/TableHeadKit';
import TableRowKit from '../../kits/tablerow/TableRowKit';
import TableCellKit from '../../kits/tablecell/TableCellKit';
import TableContainerKit from '../../kits/tablecontainer/TableContainerKit';
import TableKit from '../../kits/table/TableKit';
import TableBodyKit from '../../kits/tablebody/TableBodyKit';
import useDate from '../../hooks/useDate';
import talabat from '../../assets/images/talabat.png';
import deliveroo from '../../assets/images/deliveroo.png';
import { usePlatform } from '../../hooks/usePlatform';
import SpinnerKit from '../../kits/spinner/SpinnerKit';

const EnhancedTableHead = ({ headCells }) => (
  <TableHeadKit className="table-head">
    <TableRowKit>
      {headCells.map((headCell) => (
        <TableCellKit className="enchanced-table-cell" key={headCell.id}>
          {headCell.label}
        </TableCellKit>
      ))}
    </TableRowKit>
  </TableHeadKit>
);

const EnhancedTable = ({ title, metricsbeforePeriod, metricsafterPeriod, loading }) => {
  const { date } = useDate();
  const { beforePeriod, afterPeriod, titleDate, titleafterPeriod, typeDate } = date;
  const { userPlatformData } = usePlatform();

  const getTitle = () => {
    if (title === 'n_orders') {
      return 'orders';
    }
    if (title === 'average_basket') {
      return 'Avg.basket';
    }
    if (title === 'accrued_discounts') {
      return 'discount offered';
    }
    if (title === 'profit') {
      return 'net revenue';
    }
    return title;
  };
  const getafterPeriod = () => {
    if (titleafterPeriod === 'custom') {
      if (typeDate === 'day') {
        return `${dayjs(afterPeriod.startDate).format('DD/MM')}`;
      }
      if (typeDate === 'month') {
        return `${format(new Date(afterPeriod.startDate), 'LLL', {
          locale: enUS,
        })}  -  ${getYear(new Date(afterPeriod.startDate))}`;
      }

      return `${dayjs(afterPeriod.startDate).format('DD/MM')} - ${dayjs(afterPeriod.endDate).format(
        'DD/MM',
      )}`;
    }

    return titleafterPeriod;
  };

  const getbeforePeriod = () => {
    if (titleDate === 'custom') {
      if (typeDate === 'day') {
        return `${dayjs(beforePeriod.startDate).format('DD/MM')}`;
      }
      if (typeDate === 'month') {
        return `${format(new Date(beforePeriod.startDate), 'LLL', {
          locale: enUS,
        })}  -  ${getYear(new Date(beforePeriod.startDate))}`;
      }

      return `${dayjs(beforePeriod.startDate).format('DD/MM')} - ${dayjs(
        beforePeriod.endDate,
      ).format('DD/MM')}`;
    }

    return titleDate;
  };

  const headCells = [
    {
      id: 'type',
      numeric: false,
      disablePadding: false,
      label: getTitle(),
    },
    {
      id: 'date',
      numeric: true,
      disablePadding: false,
      label: getbeforePeriod(),
    },
    {
      id: 'date1',
      numeric: true,
      disablePadding: false,
      label: getafterPeriod(),
    },
    {
      id: 'evolution',
      numeric: true,
      disablePadding: false,
      label: 'Evolution',
    },
  ];

  const procentTalabat = () => {
    if (metricsbeforePeriod.talabat && metricsafterPeriod.talabat) {
      if (Number(metricsafterPeriod.talabat[title]) === 0) {
        return 0;
      }

      return parseFloat(
        Number(
          (
            metricsbeforePeriod.talabat[title] / (metricsafterPeriod.talabat[title] / 100) -
            100
          ).toFixed(0),
        ),
      );
    }
    return '-';
  };

  const procentDeliveroo = () => {
    if (metricsbeforePeriod.deliveroo && metricsafterPeriod.deliveroo) {
      if (Number(metricsafterPeriod.deliveroo[title]) === 0) {
        return 0;
      }

      return parseFloat(
        Number(
          (
            metricsbeforePeriod.deliveroo[title] / (metricsafterPeriod.deliveroo[title] / 100) -
            100
          ).toFixed(0),
        ),
      );
    }
    return '-';
  };
  const procentTotal = () => {
    if (metricsbeforePeriod.all && metricsafterPeriod.all) {
      if (Number(metricsafterPeriod.all[title]) === 0) {
        return 0;
      }

      return Number(
        parseFloat(
          (metricsbeforePeriod.all[title] / (metricsafterPeriod.all[title] / 100) - 100).toFixed(0),
        ),
      );
    }
    return '-';
  };
  const evolution = (procent) => {
    if (Number.isNaN(procent)) {
      return '-';
    }
    if (procent > 0) {
      return `+ ${procent}%`;
    }
    return `${procent}%`;
  };
  const getNum = (metrics) => {
    if (metrics) {
      if (Number.isNaN(metrics[title]) || metrics[title] === null) {
        return '-';
      }
      if (getTitle() === 'roi') {
        return `${Math.round(metrics[title] * 100)} %`;
      }
      return parseFloat(Number(metrics[title]).toFixed(1));
    }
    return '-';
  };
  return (
    <BoxKit sx={{ width: '100%' }}>
      <PaperKit className="table-paper-wrapper">
        <TableContainerKit>
          <TableKit className="table" aria-labelledby="tableTitle" size="medium">
            <EnhancedTableHead headCells={headCells} />
            <TableBodyKit className="table-body">
              {!userPlatformData.platforms.deliveroo.active ? null : (
                <TableRowKit tabIndex={-1} className="table-row">
                  <TableCellKit component="th" id={0} scope="row">
                    <img
                      className={`table-img ${title === 'deliveroo' ? 'img-del' : ''}`}
                      src={deliveroo}
                      alt={title}
                    />
                  </TableCellKit>
                  <TableCellKit>
                    {loading ? (
                      <SpinnerKit className="loading-table" />
                    ) : (
                      getNum(metricsbeforePeriod.deliveroo)
                    )}
                  </TableCellKit>
                  <TableCellKit>
                    {loading ? (
                      <SpinnerKit className="loading-table" />
                    ) : (
                      getNum(metricsafterPeriod.deliveroo)
                    )}
                  </TableCellKit>
                  <TableCellKit>
                    {loading ? (
                      <SpinnerKit className="loading-table" />
                    ) : (
                      <div
                        className={`table_evolution ${
                          procentDeliveroo() > 0 ? 'table_increased' : ''
                        } ${procentDeliveroo() < 0 ? 'table_decreased' : ''}`}
                      >
                        <span>{evolution(procentDeliveroo())}</span>
                      </div>
                    )}
                  </TableCellKit>
                </TableRowKit>
              )}
              {!userPlatformData.platforms.talabat.active ? null : (
                <TableRowKit tabIndex={-1} key={title} className="table-row">
                  <TableCellKit component="th" id={0} scope="row">
                    <img
                      className={`table-img ${title === 'deliveroo' ? 'img-del' : ''}`}
                      src={talabat}
                      alt={title}
                    />
                  </TableCellKit>
                  <TableCellKit>
                    {loading ? (
                      <SpinnerKit className="loading-table" />
                    ) : (
                      getNum(metricsbeforePeriod.talabat)
                    )}
                  </TableCellKit>
                  <TableCellKit>
                    {loading ? (
                      <SpinnerKit className="loading-table" />
                    ) : (
                      getNum(metricsafterPeriod.talabat)
                    )}
                  </TableCellKit>
                  <TableCellKit>
                    {loading ? (
                      <SpinnerKit className="loading-table" />
                    ) : (
                      <div
                        className={`table_evolution ${
                          procentTalabat() > 0 ? 'table_increased' : ''
                        } ${procentTalabat() < 0 ? 'table_decreased' : ''}`}
                      >
                        <span>{evolution(procentTalabat())}</span>
                      </div>
                    )}
                  </TableCellKit>
                </TableRowKit>
              )}
            </TableBodyKit>
            <TableHeadKit>
              <TableRowKit className="table-row table-total">
                <TableCellKit component="th" scope="row">
                  Total
                </TableCellKit>
                <TableCellKit>
                  {loading ? (
                    <SpinnerKit className="loading-table" />
                  ) : (
                    getNum(metricsbeforePeriod.all)
                  )}
                </TableCellKit>
                <TableCellKit>
                  {loading ? (
                    <SpinnerKit className="loading-table" />
                  ) : (
                    getNum(metricsafterPeriod.all)
                  )}
                </TableCellKit>
                <TableCellKit>
                  {loading ? (
                    <SpinnerKit className="loading-table" />
                  ) : (
                    <div
                      className={`table_evolution ${procentTotal() > 0 ? 'table_increased' : ''} ${
                        procentTotal() < 0 ? 'table_decreased' : ''
                      }`}
                    >
                      <span>
                        <span>{evolution(procentTotal())}</span>
                      </span>
                    </div>
                  )}
                </TableCellKit>
              </TableRowKit>
            </TableHeadKit>
          </TableKit>
        </TableContainerKit>
      </PaperKit>
    </BoxKit>
  );
};

export default EnhancedTable;
