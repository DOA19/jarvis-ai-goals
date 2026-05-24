CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  emoji TEXT,
  accent_color TEXT,
  next_action TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id TEXT REFERENCES categories(id),
  text TEXT NOT NULL,
  done BOOLEAN DEFAULT false,
  impact INTEGER DEFAULT 3,
  type TEXT DEFAULT 'maintenance',
  due_phase INTEGER DEFAULT 2,
  ai_generated BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS brain_dumps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  raw_text TEXT NOT NULL,
  ai_response JSONB,
  changes_made JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS progress_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_date DATE DEFAULT CURRENT_DATE,
  category_progress JSONB,
  tasks_completed INTEGER,
  overall_status TEXT,
  ai_assessment TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id TEXT REFERENCES categories(id),
  title TEXT NOT NULL,
  target_month TEXT,
  done BOOLEAN DEFAULT false,
  ai_generated BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO categories (id, label, emoji, accent_color, next_action) VALUES
  ('medicine', 'Medicine', '🧬', '#00d4ff', 'Talk to Mom about MCAT plan. Follow up on PCT access via email.'),
  ('acting', 'Acting', '🎭', '#a78bff', 'DM John or Athena about headshot photographers. Check Actors Access.'),
  ('school', 'School', '📚', '#00ff9d', 'Talk to Mom about capstone scope. Find Tejas'' biochem cheat sheets.'),
  ('fitness', 'Fitness', '💪', '#fbbf24', 'Pick your primary gym and block 3 workout slots per week.'),
  ('fun', 'Fun / Social', '🎡', '#ff6b6b', 'Text the group about Six Flags Hurricane Harbor — target June.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO tasks (category_id, text, impact, type, due_phase) VALUES
  ('medicine', 'Talk to Mom about MCAT summer plan', 5, 'uncertainty', 1),
  ('medicine', 'Send PCT access follow-up email', 5, 'unlock', 1),
  ('medicine', 'Make first shadowing lead list', 3, 'outreach', 2),
  ('acting', 'DM John or Athena about headshot photographer', 5, 'uncertainty', 1),
  ('acting', 'Find 3-5 headshot photographers on Instagram', 4, 'research', 1),
  ('acting', 'Check Actors Access setup requirements', 4, 'unlock', 2),
  ('school', 'Talk to Mom about capstone scope', 5, 'uncertainty', 1),
  ('school', 'Locate Tejas'' biochem cheat sheets', 3, 'unlock', 1),
  ('school', 'Clarify AI paper responsibilities with group', 4, 'deadline', 2),
  ('fitness', 'Pick your primary gym (Planet Fitness or 24 Hour)', 4, 'unlock', 1),
  ('fun', 'Text friends about a June Six Flags date', 4, 'deadline', 1);

INSERT INTO milestones (category_id, title, target_month) VALUES
  ('medicine', 'Resolve MCAT and PCT uncertainty', 'May'),
  ('acting', 'Find headshot photographer lead', 'May'),
  ('medicine', 'PCT access and first shadowing lead list', 'June'),
  ('acting', 'Book or complete headshot session', 'June'),
  ('fitness', 'Three workout weeks in a row', 'June'),
  ('fun', 'Six Flags date locked', 'June'),
  ('school', 'Draft visible capstone pages', 'July'),
  ('acting', 'Actors Access profile ready', 'July'),
  ('school', 'Finish school deliverables and fall prep', 'August'),
  ('fitness', 'Lock fall workout routine', 'August');
