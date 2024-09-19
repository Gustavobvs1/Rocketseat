import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { createGoalCompletion } from '../../functions/create-goal-completion';

export const createCompletionRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/completions',
    {
      schema: {
        body: z.object({
          goalId: z.string().cuid2(),
        }),
      },
    },
    async req => {
      const { goalId } = req.body;
      await createGoalCompletion({
        goalId,
      });
    }
  );
};
