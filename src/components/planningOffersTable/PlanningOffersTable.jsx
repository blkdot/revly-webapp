import * as React from 'react';
import TableRow from '@mui/material/TableRow';
import TableContainerKit from '../../kits/tablecontainer/TableContainerKit';
import TableKit from '../../kits/table/TableKit';
import TableHeadKit from '../../kits/tablehead/TableHeadKit';
import TableRowKit from '../../kits/tablerow/TableRowKit';
import TableCellKit from '../../kits/tablecell/TableCellKit';
import TableBodyKit from '../../kits/tablebody/TableBodyKit';
import PaperKit from '../../kits/paper/PaperKit';
import talabat from '../../assets/images/talabat.png';
import deliveroo from '../../assets/images/deliveroo.png';
import './PlanningOffersTable.scss';
import BoxKit from '../../kits/box/BoxKit';

const PlanningOffersTable = ({ rows }) => (
  <BoxKit sx={{ width: '100%' }}>
    <TableContainerKit className="planning_offers-table-container" component={PaperKit}>
      <TableKit aria-label="simple table">
        <TableHeadKit className="planning_table-head">
          <TableRowKit>
            <TableCellKit>Vendor name</TableCellKit>
            <TableCellKit>Platform</TableCellKit>
            <TableCellKit>Discount type</TableCellKit>
            <TableCellKit>Discount rate</TableCellKit>
            <TableCellKit>Min.Order</TableCellKit>
            <TableCellKit>Start date</TableCellKit>
            <TableCellKit>End date</TableCellKit>
            <TableCellKit>Target</TableCellKit>
            <TableCellKit>Status</TableCellKit>
          </TableRowKit>
        </TableHeadKit>
        <TableBodyKit>
          {rows.map((row) => (
            <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCellKit>{row.vendor_name === null ? '-' : row.vendor_name}</TableCellKit>
              <TableCellKit>
                <img
                  className="planning-platform"
                  src={row.platform === 'deliveroo' ? deliveroo : talabat}
                  alt={row.platform}
                />
              </TableCellKit>
              <TableCellKit>{row.discount_type}</TableCellKit>
              <TableCellKit>{row.discount_rate}</TableCellKit>
              <TableCellKit>{row.minimum_order_value}</TableCellKit>
              <TableCellKit>{row.start_date}</TableCellKit>
              <TableCellKit>{row.end_date}</TableCellKit>
              <TableCellKit>{row.target === null ? '-' : row.target}</TableCellKit>
              <TableCellKit>{row.status}</TableCellKit>
            </TableRow>
          ))}
        </TableBodyKit>
      </TableKit>
    </TableContainerKit>
  </BoxKit>
);

export default PlanningOffersTable;
