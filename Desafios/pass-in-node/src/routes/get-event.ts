import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { NotFound } from "./_errors/not-found";

export async function getEvent(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/events/:eventId",
    {
      schema: {
        summary: "Get an event using his uuid",
        tags: ["events"],
        params: z.object({
          eventId: z.string().uuid(),
        }),
        response: {
          200: z.object({
            event: z.object({
              id: z.string().uuid(),
              title: z.string(),
              details: z.string().nullable(),
              slug: z.string(),
              maximumAttendees: z.number().int().nullable(),
              attendeesAmount: z.number().int(),
            }),
          }),
          400: z.object({
            message: z.string(),
            errors: z.object({
              eventId: z.array(z.string()),
            }),
          }),
        },
      },
    },
    async (req, res) => {
      const { eventId } = req.params;

      const event = await prisma.event.findUnique({
        where: {
          id: eventId,
        },
        select: {
          id: true,
          title: true,
          details: true,
          slug: true,
          _count: true,
          maximumAttendees: true,
        },
      });

      if (event === null) throw new NotFound("Event not found.");

      return res.send({
        event: {
          id: event.id,
          title: event.title,
          details: event.details,
          slug: event.slug,
          maximumAttendees: event.maximumAttendees,
          attendeesAmount: event._count.attendees,
        },
      });
    }
  );
}
