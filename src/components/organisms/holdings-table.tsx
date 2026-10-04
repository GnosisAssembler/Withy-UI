import {
  ColumnSparkline,
  DataTable,
  SignedFigures,
  TickerCell,
  type Column,
} from "@/components/organisms/data-table";
import { holdings, type Holding } from "@/data/holdings";

const ratio = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

const columns: Column<Holding>[] = [
  {
    key: "ticker",
    header: "Ticker",
    width: "28%",
    filterValue: (row) => `${row.symbol} ${row.name}`,
    sortValue: (row) => row.symbol,
    cell: (row) => (
      <TickerCell symbol={row.symbol} name={row.name} mark={row.mark} tone={row.tone} />
    ),
  },
  {
    key: "timeline",
    header: "Timeline",
    width: "18%",
    filterValue: (row) => String(Math.max(...row.timeline)),
    sortValue: (row) => row.timeline.reduce((sum, value) => sum + value, 0),
    cell: (row) => <ColumnSparkline data={row.timeline} label={`${row.symbol} timeline`} />,
  },
  {
    key: "instrument",
    header: "Instrument",
    filterValue: (row) => row.instrument,
    sortValue: (row) => row.instrument,
    cell: (row) => row.instrument,
  },
  {
    key: "pnl",
    header: "P&L",
    filterValue: (row) => `${row.pnl} ${row.ratio}`,
    sortValue: (row) => row.pnl,
    cell: (row) => <SignedFigures value={row.pnl} note={ratio.format(row.ratio)} />,
  },
  {
    key: "total",
    header: "Total Value",
    filterValue: (row) => `${row.change} ${row.total}`,
    sortValue: (row) => row.total,
    cell: (row) => <SignedFigures value={row.change} note={ratio.format(row.total)} strongNote />,
  },
];

export function HoldingsTable() {
  return (
    <DataTable columns={columns} rows={holdings} getRowKey={(row) => row.id} caption="Holdings" />
  );
}
