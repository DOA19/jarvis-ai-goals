const START_DATE = new Date('2026-05-18T00:00:00');
const END_DATE = new Date('2026-09-02T23:59:59');

export function getCountdown(now = new Date()) {
  const msPerDay = 1000 * 60 * 60 * 24;
  const remainingMs = Math.max(0, END_DATE.getTime() - now.getTime());
  const totalMs = END_DATE.getTime() - START_DATE.getTime();
  const elapsedMs = Math.min(Math.max(0, now.getTime() - START_DATE.getTime()), totalMs);
  const daysLeft = Math.ceil(remainingMs / msPerDay);
  const weeksLeft = Math.ceil(daysLeft / 7);
  const percentElapsed = Math.round((elapsedMs / totalMs) * 100);

  return {
    daysLeft,
    weeksLeft,
    percentElapsed,
    percentRemaining: Math.max(0, 100 - percentElapsed)
  };
}

export function formatDateLabel(date = new Date()) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}
