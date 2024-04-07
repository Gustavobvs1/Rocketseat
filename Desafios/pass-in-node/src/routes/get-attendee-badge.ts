import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { NotFound } from "./_errors/not-found";

export async function getAttendeeBadge(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/attendees/:attendeeId/badge",
    {
      schema: {
        summary: "Get the badge of an attendee",
        tags: ["attendees"],
        params: z.object({
          attendeeId: z.coerce.number().int(),
        }),
        response: {
          200: z.object({
            badge: z.object({
              id: z.number().int(),
              name: z.string(),
              email: z.string().email(),
              eventTitle: z.string(),
              checkInURL: z.string().url(),
            }),
          }),
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (req, res) => {
      const { attendeeId } = req.params;

      const attendee = await prisma.attendee.findUnique({
        where: {
          id: attendeeId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          event: {
            select: {
              title: true,
            },
          },
        },
      });

      if (attendee === null) {
        throw new NotFound("Attendee not found");
      }
      const baseUrl = `${req.protocol}://${req.hostname}`;

      const checkInURL = new URL(`/attendees/${attendeeId}/check-in`, baseUrl);

      return res.send({
        badge: {
          id: attendee.id,
          name: attendee.name,
          email: attendee.email,
          eventTitle: attendee.event.title,
          checkInURL: checkInURL.toString(),
        },
      });
    }
  );
}
