// TODO: fix all linter problem
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import './Table.scss';

import { endOfMonth, format, getYear } from 'date-fns';
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

  const startLocal = leftDate.startDate.toLocaleDateString();
  const endLocal = leftDate.endDate.toLocaleDateString();
  const startGetDate = leftDate.startDate.getDate();
  const endGetDate = leftDate.endDate.getDate();

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
        return `${dayjs(rightDate.startDate).format('DD/MM')}'s`;
      }
      if (
        startGetDateRight === 1 &&
        endGetDateRight === endOfMonth(rightDate.startDate, 1).getDate()
      ) {
        return `${format(rightDate.startDate, 'LLL', { locale: enUS })}'s  -  ${getYear(
          rightDate.startDate,
        )}`;
      }

      return `${dayjs(rightDate.startDate).format('DD/MM')} - ${dayjs(rightDate.endDate).format(
        'DD/MM',
      )}'s`;
    }

    return `${titleRightDate}'s`;
  };
  const getLeftDate = () => {
    if (titleDate === 'custom') {
      if (startLocal === endLocal) {
        return `${dayjs(leftDate.startDate).format('DD/MM')}'s`;
      }
      if (startGetDate === 1 && endGetDate === endOfMonth(leftDate.startDate, 1).getDate()) {
        return `${format(leftDate.startDate, 'LLL', { locale: enUS })}'s  -  ${getYear(
          leftDate.startDate,
        )}`;
      }

      return `${dayjs(leftDate.startDate).format('DD/MM')} - ${dayjs(leftDate.endDate).format(
        'DD/MM',
      )}'s`;
    }

    return `${titleDate}'s`;
  };

  const startLocalRight = rightDate.startDate.toLocaleDateString();
  const endLocalRight = rightDate.endDate.toLocaleDateString();
  const startGetDateRight = rightDate.startDate.getDate();
  const endGetDateRight = rightDate.endDate.getDate();
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

  const procentTalabat =
    metricsLeft[0] && metricsRight[0]
      ? Number(
          (
            (metricsLeft[0][1][title] - metricsRight[0][1][title]) /
            metricsLeft[0][1][title]
          ).toFixed(2),
        )
      : 0;

  const procentDeliveroo =
    metricsLeft[0] && metricsRight[0]
      ? Number(
          (
            (metricsLeft[0][1][title] - metricsRight[0][1][title]) /
            metricsLeft[0][1][title]
          ).toFixed(2),
        )
      : 0;

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
                <TableCellKit>{metricsLeft[0] ? metricsLeft[0][1][title] : '-'}</TableCellKit>
                <TableCellKit>{metricsRight[0] ? metricsRight[0][1][title] : '-'}</TableCellKit>
                <TableCellKit>
                  <div
                    className={`table_evolution ${procentDeliveroo > 0 ? 'table_increased' : ''} ${
                      procentDeliveroo < 0 ? 'table_decreased' : ''
                    }`}>
                    <span>{Number.isNaN(procentDeliveroo) ? '-' : procentDeliveroo} %</span>
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
                <TableCellKit>{metricsLeft[1] ? metricsLeft[1][1][title] : '-'}</TableCellKit>
                <TableCellKit>{metricsRight[1] ? metricsRight[1][1][title] : '-'}</TableCellKit>
                <TableCellKit>
                  <div
                    className={`table_evolution ${procentTalabat > 0 ? 'table_increased' : ''} ${
                      procentTalabat < 0 ? 'table_decreased' : ''
                    }`}>
                    <span>{Number.isNaN(procentTalabat) ? '-' : procentTalabat} %</span>
                  </div>
                </TableCellKit>
              </TableRowKit>
            </TableBodyKit>
            <TableHeadKit>
              <TableRowKit className="table-row table-total">
                <TableCellKit component="th" scope="row">
                  Total
                </TableCellKit>
                <TableCellKit>{metricsLeft[2] ? metricsLeft[2][1][title] : '-'}</TableCellKit>
                <TableCellKit>{metricsRight[2] ? metricsRight[2][1][title] : '-'}</TableCellKit>
                <TableCellKit>
                  <div
                    className={`table_evolution ${
                      procentDeliveroo + procentTalabat > 0 ? 'table_increased' : ''
                    } ${procentDeliveroo + procentTalabat < 0 ? 'table_decreased' : ''}`}>
                    <span>
                      <span>
                        {Number.isNaN(procentDeliveroo + procentTalabat)
                          ? '-'
                          : procentDeliveroo + procentTalabat}{' '}
                        %
                      </span>
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
