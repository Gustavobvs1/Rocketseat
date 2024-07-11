import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { dayjs } from "../lib/dayjs";
import { prisma } from "../lib/prisma";
import { ClientError } from "../errors/client-error";

export async function createActivity(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/trips/:tripId/activity",
    {
      schema: {
        body: z.object({
          title: z.string().min(4),
          occurs_at: z.coerce.date(),
        }),
        params: z.object({
          tripId: z.string().uuid(),
        }),
      },
    },
    async (req, res) => {
      const { title, occurs_at } = req.body;
      const { tripId } = req.params;

      const trip = await prisma.trip.findUnique({
        where: {
          id: tripId,
        },
      });

      if (!trip) throw new ClientError("Trip not found");
      else if (dayjs(occurs_at).isBefore(trip.starts_at))
        throw new ClientError("Invalid activity date");
      else if (dayjs(occurs_at).isAfter(trip.ends_at))
        throw new ClientError("Invalid activity date");

      const activity = await prisma.activity.create({
        data: {
          title,
          occurs_at,
          trip_id: tripId,
        },
      });

      return { activityId: activity.id };
    }
  );
}
