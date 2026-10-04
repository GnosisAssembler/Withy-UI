import { cn } from "@/lib/cn";

type SparklineProps = {
  data: number[];
  color?: string;
  className?: string;
  label?: string;
};

export function Sparkline({
  data,
  color = "var(--primary)",
  className,
  label = "Trend",
}: SparklineProps) {
  const width = 160;
  const height = 48;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const points = data
    .map((value, index) => {
      const x = data.length === 1 ? width / 2 : (index / (data.length - 1)) * width;
      const y = height - 4 - ((value - min) / span) * (height - 8);
      return `${x},${y}`;
    })
    .join(" ");
  const last = points.split(" ").at(-1)?.split(",") ?? ["0", "0"];
  const area = `0,${height} ${points} ${width},${height}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("h-12 w-full", className)}
      role="img"
      aria-label={label}
    >
      <polygon points={area} fill={color} opacity="0.12" />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r="2.5" fill={color} />
    </svg>
  );
}
