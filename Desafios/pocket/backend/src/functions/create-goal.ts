import { db } from '../db';
import { goals } from '../db/schema';

interface CreateGoalProps {
  title: string;
  desiredWeeklyFrequency: number;
}

export async function createGoal({
  desiredWeeklyFrequency,
  title,
}: CreateGoalProps) {
  const result = await db
    .insert(goals)
    .values({
      title,
      desiredWeeklyFrequency,
    })
    .returning();

  const goal = result[0];

  return {
    goal,
  };
}
