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

const EnhancedTable = ({ title, metricsLeft, metricsRight }) => {
  const { titleRightDate, rightDate, titleDate, leftDate } = useDate();

  const startDate = parseISO(leftDate.startDate);
  const endDate = parseISO(leftDate.endDate);
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
  const getRightDate = () => {
    if (titleRightDate === 'custom') {
      if (startLocalRight === endLocalRight) {
        return `${dayjs(rightDate.startDate).format('DD/MM')}`;
      }
      if (
        startGetDateRight === 1 &&
        endGetDateRight === endOfMonth(parseISO(rightDate.startDate), 1).getDate()
      ) {
        return `${format(parseISO(rightDate.startDate), 'LLL', { locale: enUS })}  -  ${getYear(
          parseISO(rightDate.startDate),
        )}`;
      }

      return `${dayjs(rightDate.startDate).format('DD/MM')} - ${dayjs(rightDate.endDate).format(
        'DD/MM',
      )}`;
    }

    return `${titleRightDate}'s`;
  };
  const getLeftDate = () => {
    if (titleDate === 'custom') {
      if (startLocal === endLocal) {
        return `${dayjs(leftDate.startDate).format('DD/MM')}`;
      }
      if (
        startGetDate === 1 &&
        endGetDate === endOfMonth(parseISO(leftDate.startDate), 1).getDate()
      ) {
        return `${format(parseISO(leftDate.startDate), 'LLL', { locale: enUS })}  -  ${getYear(
          parseISO(leftDate.startDate),
        )}`;
      }

      return `${dayjs(leftDate.startDate).format('DD/MM')} - ${dayjs(leftDate.endDate).format(
        'DD/MM',
      )}`;
    }

    return `${titleDate}'s`;
  };

  const startDateRight = parseISO(rightDate.startDate);
  const endDateRight = parseISO(rightDate.endDate);
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
      label: getLeftDate(),
    },
    {
      id: 'date1',
      numeric: true,
      disablePadding: false,
      label: getRightDate(),
    },
    {
      id: 'evolution',
      numeric: true,
      disablePadding: false,
      label: 'Evolution',
    },
  ];

  const procentTalabat = () => {
    if (metricsLeft[2] && metricsRight[2]) {
      if (Number(metricsRight[2][1][title]) === 0) {
        return 0;
      }

      return Number(
        (metricsLeft[2][1][title] / (metricsRight[2][1][title] / 100) - 100).toFixed(2),
      );
    }
    return '-';
  };

  const procentDeliveroo = () => {
    if (metricsLeft[1] && metricsRight[1]) {
      if (Number(metricsRight[1][1][title]) === 0) {
        return 0;
      }

      return Number(
        (metricsLeft[1][1][title] / (metricsRight[1][1][title] / 100) - 100).toFixed(2),
      );
    }
    return '-';
  };
  const procentTotal = () => {
    if (metricsLeft[0] && metricsRight[0]) {
      if (Number(metricsRight[0][1][title]) === 0) {
        return 0;
      }

      return Number(
        (metricsLeft[0][1][title] / (metricsRight[0][1][title] / 100) - 100).toFixed(2),
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
              <TableRowKit tabIndex={-1} className="table-row">
                <TableCellKit component="th" id={0} scope="row">
                  <img
                    className={`table-img ${title === 'deliveroo' ? 'img-del' : ''}`}
                    src={deliveroo}
                    alt={title}
                  />
                </TableCellKit>
                <TableCellKit>{getNum(metricsLeft[1])}</TableCellKit>
                <TableCellKit>{getNum(metricsRight[1])}</TableCellKit>
                <TableCellKit>
                  <div
                    className={`table_evolution ${
                      procentDeliveroo() > 0 ? 'table_increased' : ''
                    } ${procentDeliveroo() < 0 ? 'table_decreased' : ''}`}>
                    <span>{evolution(procentDeliveroo())}</span>
                  </div>
                </TableCellKit>
              </TableRowKit>
              <TableRowKit tabIndex={-1} key={title} className="table-row">
                <TableCellKit component="th" id={0} scope="row">
                  <img
                    className={`table-img ${title === 'deliveroo' ? 'img-del' : ''}`}
                    src={talabat}
                    alt={title}
                  />
                </TableCellKit>
                <TableCellKit>{getNum(metricsLeft[2])}</TableCellKit>
                <TableCellKit>{getNum(metricsRight[2])}</TableCellKit>
                <TableCellKit>
                  <div
                    className={`table_evolution ${procentTalabat() > 0 ? 'table_increased' : ''} ${
                      procentTalabat() < 0 ? 'table_decreased' : ''
                    }`}>
                    <span>{evolution(procentTalabat())}</span>
                  </div>
                </TableCellKit>
              </TableRowKit>
            </TableBodyKit>
            <TableHeadKit>
              <TableRowKit className="table-row table-total">
                <TableCellKit component="th" scope="row">
                  Total
                </TableCellKit>
                <TableCellKit>{getNum(metricsLeft[0])}</TableCellKit>
                <TableCellKit>{getNum(metricsRight[0])}</TableCellKit>
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
