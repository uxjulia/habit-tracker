import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  isToday,
  isSameMonth,
  parseISO,
} from "date-fns";

export const toISODate = (date: Date): string => format(date, "yyyy-MM-dd");

/** Parse a YYYY-MM-DD string without UTC offset issues */
export const fromISODate = (s: string): Date => parseISO(s);
export const formatDisplayDate = (date: Date): string => format(date, "MMMM d, yyyy");
export const formatShortDate = (date: Date): string => format(date, "MMM d");
export const formatDayOfWeek = (date: Date): string => format(date, "EEE");
export const formatDayNumber = (date: Date): string => format(date, "d");
export const formatMonthYear = (date: Date): string => format(date, "MMMM yyyy");
export const formatWeekRange = (start: Date, end: Date): string =>
  `${format(start, "MMM d")} – ${format(end, "MMM d, yyyy")}`;

/** Convert "HH:mm" (24-hour) to "h:mm AM/PM" (12-hour) */
export const formatTime = (time: string): string => {
  const [h, m] = time.split(":").map(Number);
  const period = h < 12 ? "AM" : "PM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
};

export const getWeekDays = (referenceDate: Date): Date[] =>
  eachDayOfInterval({
    start: startOfWeek(referenceDate, { weekStartsOn: 0 }),
    end: endOfWeek(referenceDate, { weekStartsOn: 0 }),
  });

export const getMonthDays = (referenceDate: Date): Date[] =>
  eachDayOfInterval({
    start: startOfMonth(referenceDate),
    end: endOfMonth(referenceDate),
  });

export const getWeekStart = (date: Date) => startOfWeek(date, { weekStartsOn: 0 });
export const getWeekEnd = (date: Date) => endOfWeek(date, { weekStartsOn: 0 });

export { addWeeks, subWeeks, addMonths, subMonths, isToday, isSameMonth, startOfMonth, endOfMonth };
