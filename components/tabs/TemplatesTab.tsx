import { PromptBox } from '@/components/ui/PromptBox';

const dailyPlan = `Daily Plan
1. Today's #1 task:
2. One medicine/school move:
3. One acting/fitness/fun move:
4. Fixed commitments:
5. Recovery block:
6. End-of-day proof:`;

const weeklyReview = `Weekly Review
Wins:
Tasks completed:
Where I avoided the real blocker:
One goal that needs attention:
Next week's top priority:
What I am allowed to ignore:`;

const overload = `Overload Protocol
1. Drink water.
2. Pick one task that removes uncertainty.
3. Work for 10 minutes only.
4. Stop or continue. Both count.
5. Tell J.A.R.V.I.S. what happened.`;

export function TemplatesTab() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <PromptBox title="Daily Plan" text={dailyPlan} />
      <PromptBox title="Weekly Review" text={weeklyReview} />
      <PromptBox title="Overload Protocol" text={overload} />
    </div>
  );
}
