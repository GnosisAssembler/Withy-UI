import type { TrackerBlock, TrackerColor } from "./tracker";

function block(day: number, color: TrackerColor, status: string): TrackerBlock {
  return { id: `day-${day}`, color, tooltip: `Day ${day}: ${status}` };
}

/** Sample uptime history for docs and stories. Oldest day first. */
export function uptimeTrackerSample(length = 48): TrackerBlock[] {
  return Array.from({ length }, (_, index) => {
    const day = index + 1;
    if (day <= 4) return block(day, "neutral", "No data");
    if (day % 29 === 0) return block(day, "danger", "Down for 14 minutes");
    if (day % 17 === 0) return block(day, "warning", "Degraded response time");
    if (day % 23 === 0) return block(day, "info", "Maintenance for 20 minutes");
    return block(day, "success", "Operational");
  });
}
