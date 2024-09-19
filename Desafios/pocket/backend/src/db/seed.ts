import dayjs from 'dayjs';
import { client, db } from '.';
import { goalCompletions, goals } from './schema';

async function seed() {
  await db.delete(goalCompletions);
  await db.delete(goals);

  const result = await db
    .insert(goals)
    .values([
      { title: 'Acordar cedo', desiredWeeklyFrequency: 3 },
      { title: 'Jogar', desiredWeeklyFrequency: 3 },
    ])
    .returning();

  const startOfWeek = dayjs().startOf('week');

  await db.insert(goalCompletions).values([
    {
      goalId: result[0].id,
      createdAt: startOfWeek.add(1, 'day').toDate(),
    },
    {
      goalId: result[1].id,
      createdAt: startOfWeek.toDate(),
    },
  ]);
}

seed().finally(() => client.end());