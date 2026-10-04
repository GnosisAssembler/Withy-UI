export type CalendarEvent = {
  id: string;
  date: string;
  title: string;
  time: string;
  color: "primary" | "success" | "warning" | "pink" | "info";
};

export const calendarToday = "2026-10-04";

export const calendarEvents: CalendarEvent[] = [
  { id: "e1", date: "2026-10-02", title: "Pipeline review", time: "09:00", color: "primary" },
  { id: "e2", date: "2026-10-04", title: "Sprint planning", time: "10:30", color: "info" },
  { id: "e3", date: "2026-10-04", title: "Customer call", time: "14:00", color: "success" },
  { id: "e4", date: "2026-10-07", title: "Design critique", time: "11:00", color: "pink" },
  { id: "e5", date: "2026-10-09", title: "Billing dry run", time: "16:00", color: "warning" },
  { id: "e6", date: "2026-10-14", title: "Board prep", time: "13:00", color: "primary" },
  { id: "e7", date: "2026-10-16", title: "Release window", time: "18:00", color: "success" },
  { id: "e8", date: "2026-10-21", title: "Hiring loop", time: "09:30", color: "info" },
  { id: "e9", date: "2026-10-23", title: "Office hours", time: "15:00", color: "pink" },
  { id: "e10", date: "2026-10-28", title: "Quarter close", time: "11:30", color: "warning" },
  { id: "e11", date: "2026-09-29", title: "September retro", time: "16:00", color: "primary" },
  { id: "e12", date: "2026-11-03", title: "November kickoff", time: "09:00", color: "success" },
];
