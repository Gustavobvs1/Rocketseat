import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { subscribeToEvent } from "../functions/subscribe-to-event";

export const subscribeToEventRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/subscriptions",
    {
      schema: {
        summary: "Subscribes someone to the event",
        tags: ["subscription"],
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          referrerId: z.string().nullish(),
        }),
        response: {
          201: z.object({
            subscriberId: z.string(),
          }),
        },
      },
    },
    async (req, res) => {
      const { name, email, referrerId } = req.body;

      const { subscriberId } = await subscribeToEvent({
        name,
        email,
        referrerId,
      });

      return res.status(201).send({ subscriberId });
    }
  );
};
