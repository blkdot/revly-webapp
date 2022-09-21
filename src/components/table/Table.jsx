import React from 'react';
import './Table.scss';

import BoxKit from '../../kits/box/BoxKit';
import PaperKit from '../../kits/paper/PaperKit';
import TableHeadKit from '../../kits/tablehead/TableHeadKit';
import TableRowKit from '../../kits/tablerow/TableRowKit';
import TableCellKit from '../../kits/tablecell/TableCellKit';
import TableContainerKit from '../../kits/tablecontainer/TableContainerKit';
import TableKit from '../../kits/table/TableKit';
import TableBodyKit from '../../kits/tablebody/TableBodyKit';
import { endOfMonth, format, getYear } from 'date-fns';
import { enUS } from 'date-fns/locale';
import useDate from '../../hooks/useDate';
import talabat from '../../assets/images/talabat.png';
import deliveroo from '../../assets/images/deliveroo.png';
import dayjs from 'dayjs';

function EnhancedTableHead({ headCells }) {

  return (
    <TableHeadKit className='table-head'>
      <TableRowKit>
        {headCells.map((headCell, index) => (
          <TableCellKit
            className='enchanced-table-cell'
            key={index}>
            {headCell.label}
          </TableCellKit>
        ))}
      </TableRowKit>
    </TableHeadKit>
  );
}

export default function EnhancedTable({ title, metricsLeft, metricsRight }) {
  const { titleRightDate, rightDate, titleDate, leftDate } = useDate();

  const startLocal = leftDate.startDate.toLocaleDateString();
  const endLocal = leftDate.endDate.toLocaleDateString();
  const startGetDate = leftDate.startDate.getDate();
  const endGetDate = leftDate.endDate.getDate();

  const startLocalRight = rightDate.startDate.toLocaleDateString();
  const endLocalRight = rightDate.endDate.toLocaleDateString();
  const startGetDateRight = rightDate.startDate.getDate();
  const endGetDateRight = rightDate.endDate.getDate();
  const headCells = [
    {
      id: 'type',
      numeric: false,
      disablePadding: false,
      label: title === "accrued_discounts" ?
        "marketing express" : title === "n_orders" ?
          "orders" : title === "average_basket" ? "avg.basket" : title,
    },
    {
      id: 'date',
      numeric: true,
      disablePadding: false,
      label: 
        titleDate === "custom" ? startLocal === endLocal ? dayjs(leftDate.startDate).format("DD/MM") + "'s" :
        startGetDate === 1 && endGetDate === endOfMonth(leftDate.startDate, 1).getDate() ?
          `${format(leftDate.startDate, 'LLL', { locale: enUS })}'s  -  ${getYear(leftDate.startDate)}` :
          `${dayjs(leftDate.startDate).format("DD/MM")} - ${dayjs(leftDate.endDate).format("DD/MM")}'s` : titleDate + "'s",
    },
    {
      id: 'date1',
      numeric: true,
      disablePadding: false,
      label: 
        titleRightDate === "custom" ? startLocalRight === endLocalRight ? dayjs(rightDate.startDate).format("DD/MM") + "'s" :
        startGetDateRight === 1 && endGetDateRight === endOfMonth(rightDate.startDate, 1).getDate() ?
          `${format(rightDate.startDate, 'LLL', { locale: enUS })}'s  -  ${getYear(rightDate.startDate)}` :
          `${dayjs(rightDate.startDate).format("DD/MM")} - ${dayjs(rightDate.endDate).format("DD/MM")}'s` : titleRightDate + "'s",
    },
    {
      id: 'evolution',
      numeric: true,
      disablePadding: false,
      label: 'Evolution',
    },
  ];

  const procentTalabat = metricsLeft[0] && metricsRight[0] ?
    Number(((metricsLeft[0][1][title] - metricsRight[0][1][title]) / metricsLeft[0][1][title]).toFixed(2)) : 0

  const procentDeliveroo = metricsLeft[0] && metricsRight[0] ?
    Number(((metricsLeft[0][1][title] - metricsRight[0][1][title]) / metricsLeft[0][1][title]).toFixed(2)) : 0

  return (
    <BoxKit sx={{ width: '100%' }}>
      <PaperKit className='table-paper-wrapper'>
        <TableContainerKit>
          <TableKit className='table' aria-labelledby='tableTitle' size={'medium'}>
            <EnhancedTableHead
              headCells={headCells}
            />
            <TableBodyKit className="table-body">

              <TableRowKit
                tabIndex={-1}
                className='table-row'
              >
                <TableCellKit component='th' id={0} scope='row'>
                  <img className={'table-img ' + (title === 'deliveroo' ? 'img-del' : '')} src={deliveroo} alt={title} />
                </TableCellKit>
                <TableCellKit>{metricsLeft[0] ? metricsLeft[0][1][title] ? metricsLeft[0][1][title] : "-" : 0}</TableCellKit>
                <TableCellKit>{metricsRight[0] ? metricsRight[0][1][title] ? metricsRight[0][1][title] : "-" : 0}</TableCellKit>
                <TableCellKit>
                  <div
                    className={
                      'table_evolution ' +
                      (procentDeliveroo > 0 ? 'table_increased' : (procentDeliveroo < 0 ? 'table_decreased' : ''))
                    }
                  >
                    <span>{isNaN(procentDeliveroo) ? "-" : procentDeliveroo} %</span>
                  </div>
                </TableCellKit>
              </TableRowKit>
              <TableRowKit
                tabIndex={-1}
                key={title}
                className='table-row'
              >
                <TableCellKit component='th' id={0} scope='row'>
                  <img className={'table-img ' + (title === 'deliveroo' ? 'img-del' : '')} src={talabat} alt={title} />
                </TableCellKit>
                <TableCellKit>{metricsLeft[1] ? metricsLeft[1][1][title] ? metricsLeft[1][1][title] : "-" : 0}</TableCellKit>
                <TableCellKit>{metricsRight[1] ? metricsRight[1][1][title] ? metricsRight[1][1][title] : "-" : 0}</TableCellKit>
                <TableCellKit>
                  <div
                    className={
                      'table_evolution ' +
                      (
                        procentTalabat > 0 ?
                          'table_increased' : procentTalabat < 0 ?
                            'table_decreased' : ''
                      )
                    }
                  >
                    <span>{isNaN(procentTalabat) ? "-" : procentTalabat} %</span>
                  </div>
                </TableCellKit>
              </TableRowKit>

            </TableBodyKit>
            <TableHeadKit>
              <TableRowKit className='table-row table-total'>
                <TableCellKit component='th' scope='row'>
                  Total
                </TableCellKit>
                <TableCellKit>{metricsLeft[2] ? metricsLeft[2][1][title] ? metricsLeft[2][1][title] : "-" : 0}</TableCellKit>
                <TableCellKit>{metricsRight[2] ? metricsRight[2][1][title] ? metricsRight[2][1][title] : "-" : 0}</TableCellKit>
                <TableCellKit>
                  <div
                    className={
                      'table_evolution ' +
                      (
                        procentDeliveroo + procentTalabat > 0 ?
                          'table_increased' : procentDeliveroo + procentTalabat < 0 ?
                            'table_decreased' : ''
                      )

                    }
                  >
                    <span>
                      <span>{isNaN(procentDeliveroo + procentTalabat) ? "-" : procentDeliveroo + procentTalabat} %</span>
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
}
