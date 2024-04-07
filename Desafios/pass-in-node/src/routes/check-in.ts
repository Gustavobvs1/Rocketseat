import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { Conflict } from "./_errors/conflict";
import { NotFound } from "./_errors/not-found";

export async function checkIn(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/attendees/:attendeeId/check-in",
    {
      schema: {
        summary: "Check-in",
        tags: ["attendees"],
        params: z.object({
          attendeeId: z.coerce.number().int(),
        }),
        response: {
          201: z.null(),

          409: z.object({
            message: z.string(),
          }),
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (req, res) => {
      const { attendeeId } = req.params;

      const userExists = await prisma.attendee.findUnique({
        where: {
          id: attendeeId,
        },
      });

      if (!userExists) throw new NotFound("Attendee not found");

      const attendeeCheckIn = await prisma.checkIn.findUnique({
        where: {
          attendeeId,
        },
      });

      if (attendeeCheckIn != null)
        throw new Conflict("Attendee already checked in!");

      await prisma.checkIn.create({
        data: {
          attendeeId,
        },
      });

      return res.status(201).send();
    }
  );
}
