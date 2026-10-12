import { Progress } from "../atoms/progress";

export type MeterItem = {
  label: string;
  value: string;
  percent: number;
};

export function MeterList({ items }: { items: MeterItem[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item.label} className="grid grid-cols-[7.5rem_1fr_3.5rem] items-center gap-3">
          <span className="truncate text-[13px] text-text-2">{item.label}</span>
          <Progress value={item.percent} aria-label={item.label} />
          <span className="text-right font-rubik text-[13px] text-heading">{item.value}</span>
        </li>
      ))}
    </ul>
  );
}
