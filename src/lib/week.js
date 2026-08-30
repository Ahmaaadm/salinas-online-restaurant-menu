/* Date helpers for the plat du jour week planner.
   Everything is local-time: a service date is the calendar day in the
   restaurant's own timezone, so toISOString() is deliberately avoided —
   it would shift the date across midnight for anyone east or west of UTC. */

export const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
export const WEEKDAYS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const pad = n => String(n).padStart(2, '0');

export const toISODate = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/* Parse at local midnight; `new Date('2026-09-01')` would parse as UTC. */
export const fromISODate = iso => new Date(`${iso}T00:00:00`);

export const todayISO = () => toISODate(new Date());

export function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

/* Monday-start week containing `date`. The owner plans on Sunday for the
   week ahead, so Monday–Sunday keeps a plan inside one column of dates. */
export function startOfWeek(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return addDays(d, -((d.getDay() + 6) % 7));
}

export const weekDates = start => Array.from({ length: 7 }, (_, i) => toISODate(addDays(start, i)));

export const weekdayOf = iso => WEEKDAYS[(fromISODate(iso).getDay() + 6) % 7];
export const weekdayShortOf = iso => WEEKDAYS_SHORT[(fromISODate(iso).getDay() + 6) % 7];
export const dayOfMonth = iso => fromISODate(iso).getDate();

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const formatDay = iso => {
  const d = fromISODate(iso);
  return `${weekdayOf(iso)} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
};

export function formatWeekRange(start) {
  const end = addDays(start, 6);
  const sameMonth = start.getMonth() === end.getMonth();
  const left = `${start.getDate()}${sameMonth ? '' : ' ' + MONTHS[start.getMonth()]}`;
  return `${left} – ${end.getDate()} ${MONTHS[end.getMonth()]}`;
}
