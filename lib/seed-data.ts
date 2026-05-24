import { Category, Milestone, Task } from '@/types';

export const categoriesSeed: Category[] = [
  {
    id: 'medicine',
    label: 'Medicine',
    emoji: '🧬',
    accentColor: '#00d4ff',
    nextAction: 'Talk to Mom about MCAT plan. Follow up on PCT access via email.'
  },
  {
    id: 'acting',
    label: 'Acting',
    emoji: '🎭',
    accentColor: '#a78bff',
    nextAction: 'DM John or Athena about headshot photographers. Check Actors Access.'
  },
  {
    id: 'school',
    label: 'School',
    emoji: '📚',
    accentColor: '#00ff9d',
    nextAction: "Talk to Mom about capstone scope. Find Tejas' biochem cheat sheets."
  },
  {
    id: 'fitness',
    label: 'Fitness',
    emoji: '💪',
    accentColor: '#fbbf24',
    nextAction: 'Pick your primary gym and block 3 workout slots per week.'
  },
  {
    id: 'fun',
    label: 'Fun / Social',
    emoji: '🎡',
    accentColor: '#ff6b6b',
    nextAction: 'Text the group about Six Flags Hurricane Harbor — target June.'
  }
];

export const tasksSeed: Task[] = [
  { id: 'medicine-mcat-mom', categoryId: 'medicine', text: 'Talk to Mom about MCAT summer plan', done: false, impact: 5, type: 'uncertainty', duePhase: 1 },
  { id: 'medicine-pct-email', categoryId: 'medicine', text: 'Send PCT access follow-up email', done: false, impact: 5, type: 'unlock', duePhase: 1 },
  { id: 'medicine-shadowing-list', categoryId: 'medicine', text: 'Make first shadowing lead list', done: false, impact: 3, type: 'outreach', duePhase: 2 },
  { id: 'acting-dm-headshots', categoryId: 'acting', text: 'DM John or Athena about headshot photographer', done: false, impact: 5, type: 'uncertainty', duePhase: 1 },
  { id: 'acting-instagram-headshots', categoryId: 'acting', text: 'Find 3-5 headshot photographers on Instagram', done: false, impact: 4, type: 'research', duePhase: 1 },
  { id: 'acting-actors-access', categoryId: 'acting', text: 'Check Actors Access setup requirements', done: false, impact: 4, type: 'unlock', duePhase: 2 },
  { id: 'school-capstone-mom', categoryId: 'school', text: 'Talk to Mom about capstone scope', done: false, impact: 5, type: 'uncertainty', duePhase: 1 },
  { id: 'school-biochem-cheats', categoryId: 'school', text: "Locate Tejas' biochem cheat sheets", done: false, impact: 3, type: 'unlock', duePhase: 1 },
  { id: 'school-ai-paper', categoryId: 'school', text: 'Clarify AI paper responsibilities with group', done: false, impact: 4, type: 'deadline', duePhase: 2 },
  { id: 'fitness-pick-gym', categoryId: 'fitness', text: 'Pick your primary gym (Planet Fitness or 24 Hour)', done: false, impact: 4, type: 'unlock', duePhase: 1 },
  { id: 'fun-six-flags-date', categoryId: 'fun', text: 'Text friends about a June Six Flags date', done: false, impact: 4, type: 'deadline', duePhase: 1 }
];

export const milestonesSeed: Milestone[] = [
  { id: 'may-uncertainty', categoryId: 'medicine', title: 'Resolve MCAT and PCT uncertainty', targetMonth: 'May', done: false },
  { id: 'may-headshot-leads', categoryId: 'acting', title: 'Find headshot photographer lead', targetMonth: 'May', done: false },
  { id: 'june-pct-shadowing', categoryId: 'medicine', title: 'PCT access and first shadowing lead list', targetMonth: 'June', done: false },
  { id: 'june-headshots', categoryId: 'acting', title: 'Book or complete headshot session', targetMonth: 'June', done: false },
  { id: 'june-fitness-rhythm', categoryId: 'fitness', title: 'Three workout weeks in a row', targetMonth: 'June', done: false },
  { id: 'june-six-flags', categoryId: 'fun', title: 'Six Flags date locked', targetMonth: 'June', done: false },
  { id: 'july-capstone-pages', categoryId: 'school', title: 'Draft visible capstone pages', targetMonth: 'July', done: false },
  { id: 'july-actors-access', categoryId: 'acting', title: 'Actors Access profile ready', targetMonth: 'July', done: false },
  { id: 'august-final-school', categoryId: 'school', title: 'Finish school deliverables and fall prep', targetMonth: 'August', done: false },
  { id: 'august-routine', categoryId: 'fitness', title: 'Lock fall workout routine', targetMonth: 'August', done: false }
];
