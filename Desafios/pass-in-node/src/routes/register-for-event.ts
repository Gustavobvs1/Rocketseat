import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_errors/bad-request";
import { Conflict } from "./_errors/conflict";
import { Forbidden } from "./_errors/forbidden";

export async function registerForEvent(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/events/:eventId/attendees",
    {
      schema: {
        summary: "Register attendee at an event",
        tags: ["attendees"],
        body: z.object({
          name: z.string().min(4),
          email: z.string().email(),
        }),
        params: z.object({
          eventId: z.string().uuid(),
        }),
        response: {
          201: z.object({
            attendeeId: z.number(),
          }),
          400: z.object({
            message: z.string(),
            errors: z.object({
              title: z.array(z.string()),
            }),
          }),
          403: z.object({
            message: z.string(),
          }),
          409: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (req, res) => {
      const { name, email } = req.body;
      const { eventId } = req.params;

      const attendeeFromEmail = await prisma.attendee.findUnique({
        where: {
          eventId_email: {
            email,
            eventId,
          },
        },
      });

      const [amountOfAttendeesForEvent, event] = await Promise.all([
        prisma.attendee.count({
          where: {
            eventId,
          },
        }),
        prisma.event.findUnique({
          where: {
            id: eventId,
          },
        }),
      ]);

      if (attendeeFromEmail !== null) {
        throw new Conflict("This email is already for this event");
      }

      if (
        event?.maximumAttendees &&
        amountOfAttendeesForEvent >= event.maximumAttendees
      ) {
        throw new Forbidden(
          "The maximum number of attendees for this event has been exceeded"
        );
      }

      const attendee = await prisma.attendee.create({
        data: {
          name,
          email,
          eventId,
        },
      });
      return res.status(201).send({ attendeeId: attendee.id });
    }
  );
}
