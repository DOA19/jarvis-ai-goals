export const PHASES = [
  {
    index: 0,
    name: 'PHASE 1: LAUNCH',
    shortName: 'Launch',
    dateRange: '2026-05-18 to 2026-05-31',
    start: '2026-05-18',
    end: '2026-05-31',
    focus: 'Clear uncertainty. Have the key conversations. Make first contacts.',
    boost: ['medicine', 'school', 'acting']
  },
  {
    index: 1,
    name: 'PHASE 2: MOMENTUM',
    shortName: 'Momentum',
    dateRange: '2026-06-01 to 2026-06-30',
    start: '2026-06-01',
    end: '2026-06-30',
    focus: 'Build consistency. First deliverables. Headshots. PCT. Six Flags.',
    boost: ['medicine', 'acting', 'fitness', 'fun']
  },
  {
    index: 2,
    name: 'PHASE 3: EXECUTION',
    shortName: 'Execution',
    dateRange: '2026-07-01 to 2026-07-31',
    start: '2026-07-01',
    end: '2026-07-31',
    focus: 'Produce visible output. Real pages. Real submissions. Real reps.',
    boost: ['school', 'medicine', 'acting']
  },
  {
    index: 3,
    name: 'PHASE 4: CONSOLIDATION',
    shortName: 'Consolidation',
    dateRange: '2026-08-01 to 2026-08-20',
    start: '2026-08-01',
    end: '2026-08-20',
    focus: 'Finish major tasks. Lock in gains. Tighten routines for fall.',
    boost: ['school', 'medicine', 'fitness']
  },
  {
    index: 4,
    name: 'PHASE 5: FINAL PUSH',
    shortName: 'Final Push',
    dateRange: '2026-08-21 to 2026-09-02',
    start: '2026-08-21',
    end: '2026-09-02',
    focus: 'Wrap loose ends. Prep for fall. Celebrate what you built.',
    boost: ['school', 'medicine']
  }
] as const;

export function getCurrentPhase(date = new Date()) {
  const day = new Date(date.toDateString()).getTime();
  const phase = PHASES.find((item) => {
    const start = new Date(`${item.start}T00:00:00`).getTime();
    const end = new Date(`${item.end}T23:59:59`).getTime();
    return day >= start && day <= end;
  });

  if (phase) return phase;
  if (day < new Date(`${PHASES[0].start}T00:00:00`).getTime()) return PHASES[0];
  return PHASES[PHASES.length - 1];
}
