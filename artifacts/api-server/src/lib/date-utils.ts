import { format } from "date-fns";

/**
 * Get current date/time in IST (Indian Standard Time - UTC+5:30)
 */
export function getNowIST(): Date {
  const now = new Date();
  // Convert to IST by adding 5:30 hours
  const istTime = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
  return istTime;
}

/**
 * Get today's date in IST formatted as yyyy-MM-dd
 */
export function getTodayDateIST(): string {
  const now = getNowIST();
  return format(now, "yyyy-MM-dd");
}

/**
 * Get today's start of day (00:00:00) in IST
 */
export function getTodayStartIST(): Date {
  const today = new Date();
  today.setHours(5, 30, 0, 0); // Adjust for IST offset
  today.setDate(today.getDate());
  return today;
}

/**
 * Convert any date to IST format string (yyyy-MM-dd)
 */
export function dateToISTString(date: Date): string {
  const istTime = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
  return format(istTime, "yyyy-MM-dd");
}
