// TODO: fix all linter problem
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import './Table.scss';

import { endOfMonth, format, getYear, parseISO } from 'date-fns';
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

const EnhancedTable = ({ title, metricsDateFrom, metricsCompareDateValue }) => {
  const {
    titlecompareDateValue,
    compareDateValueContext: compareDateValue,
    titleDate,
    dateFromContext: dateFrom,
  } = useDate();
  const { userPlatformData } = usePlatform();

  const startDate = parseISO(dateFrom.startDate);
  const endDate = parseISO(dateFrom.endDate);
  const startLocal = startDate.toLocaleDateString();
  const endLocal = endDate.toLocaleDateString();
  const startGetDate = startDate.getDate();
  const endGetDate = endDate.getDate();

  const getTitle = () => {
    if (title === 'n_orders') {
      return 'orders';
    }
    if (title === 'average_basket') {
      return 'Avg.basket';
    }
    if (title === 'accrued_discounts') {
      return 'marketing express';
    }
    return title;
  };
  const getcompareDateValue = () => {
    if (titlecompareDateValue === 'custom') {
      if (startLocalRight === endLocalRight) {
        return `${dayjs(compareDateValue.startDate).format('DD/MM')}`;
      }
      if (
        startGetDateRight === 1 &&
        endGetDateRight === endOfMonth(parseISO(compareDateValue.startDate), 1).getDate()
      ) {
        return `${format(parseISO(compareDateValue.startDate), 'LLL', {
          locale: enUS,
        })}  -  ${getYear(parseISO(compareDateValue.startDate))}`;
      }

      return `${dayjs(compareDateValue.startDate).format('DD/MM')} - ${dayjs(
        compareDateValue.endDate,
      ).format('DD/MM')}`;
    }

    return `${titlecompareDateValue}'s`;
  };
  const getdateFrom = () => {
    if (titleDate === 'custom') {
      if (startLocal === endLocal) {
        return `${dayjs(dateFrom.startDate).format('DD/MM')}`;
      }
      if (
        startGetDate === 1 &&
        endGetDate === endOfMonth(parseISO(dateFrom.startDate), 1).getDate()
      ) {
        return `${format(parseISO(dateFrom.startDate), 'LLL', {
          locale: enUS,
        })}  -  ${getYear(parseISO(dateFrom.startDate))}`;
      }

      return `${dayjs(dateFrom.startDate).format('DD/MM')} - ${dayjs(dateFrom.endDate).format(
        'DD/MM',
      )}`;
    }

    return `${titleDate}'s`;
  };

  const startDateRight = parseISO(compareDateValue.startDate);
  const endDateRight = parseISO(compareDateValue.endDate);
  const startLocalRight = startDateRight.toLocaleDateString();
  const endLocalRight = endDateRight.toLocaleDateString();
  const startGetDateRight = startDateRight.getDate();
  const endGetDateRight = endDateRight.getDate();
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
      label: getdateFrom(),
    },
    {
      id: 'date1',
      numeric: true,
      disablePadding: false,
      label: getcompareDateValue(),
    },
    {
      id: 'evolution',
      numeric: true,
      disablePadding: false,
      label: 'Evolution',
    },
  ];

  const procentTalabat = () => {
    if (metricsDateFrom[2] && metricsCompareDateValue[2]) {
      if (Number(metricsCompareDateValue[2][1][title]) === 0) {
        return 0;
      }

      return Number(
        (metricsDateFrom[2][1][title] / (metricsCompareDateValue[2][1][title] / 100) - 100).toFixed(
          2,
        ),
      );
    }
    return '-';
  };

  const procentDeliveroo = () => {
    if (metricsDateFrom[1] && metricsCompareDateValue[1]) {
      if (Number(metricsCompareDateValue[1][1][title]) === 0) {
        return 0;
      }

      return Number(
        (metricsDateFrom[1][1][title] / (metricsCompareDateValue[1][1][title] / 100) - 100).toFixed(
          2,
        ),
      );
    }
    return '-';
  };
  const procentTotal = () => {
    if (metricsDateFrom[0] && metricsCompareDateValue[0]) {
      if (Number(metricsCompareDateValue[0][1][title]) === 0) {
        return 0;
      }

      return Number(
        (metricsDateFrom[0][1][title] / (metricsCompareDateValue[0][1][title] / 100) - 100).toFixed(
          2,
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
      if (Number.isNaN(metrics[1][title]) || metrics[1][title] === null) {
        return '-';
      }
      return metrics[1][title];
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
                  <TableCellKit>{getNum(metricsDateFrom[1])}</TableCellKit>
                  <TableCellKit>{getNum(metricsCompareDateValue[1])}</TableCellKit>
                  <TableCellKit>
                    <div
                      className={`table_evolution ${
                        procentDeliveroo() > 0 ? 'table_increased' : ''
                      } ${procentDeliveroo() < 0 ? 'table_decreased' : ''}`}>
                      <span>{evolution(procentDeliveroo())}</span>
                    </div>
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
                  <TableCellKit>{getNum(metricsDateFrom[2])}</TableCellKit>
                  <TableCellKit>{getNum(metricsCompareDateValue[2])}</TableCellKit>
                  <TableCellKit>
                    <div
                      className={`table_evolution ${
                        procentTalabat() > 0 ? 'table_increased' : ''
                      } ${procentTalabat() < 0 ? 'table_decreased' : ''}`}>
                      <span>{evolution(procentTalabat())}</span>
                    </div>
                  </TableCellKit>
                </TableRowKit>
              )}
            </TableBodyKit>
            <TableHeadKit>
              <TableRowKit className="table-row table-total">
                <TableCellKit component="th" scope="row">
                  Total
                </TableCellKit>
                <TableCellKit>{getNum(metricsDateFrom[0])}</TableCellKit>
                <TableCellKit>{getNum(metricsCompareDateValue[0])}</TableCellKit>
                <TableCellKit>
                  <div
                    className={`table_evolution ${procentTotal() > 0 ? 'table_increased' : ''} ${
                      procentTotal() < 0 ? 'table_decreased' : ''
                    }`}>
                    <span>
                      <span>{evolution(procentTotal())}</span>
                    </span>
                  </div>
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
