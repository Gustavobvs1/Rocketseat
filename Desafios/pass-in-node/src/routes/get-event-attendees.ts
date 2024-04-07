import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { NotFound } from "./_errors/not-found";

export async function getEventAttendees(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/events/:eventId/attendees",
    {
      schema: {
        tags: ["events"],
        summary: "Get all attendees at an event",
        params: z.object({
          eventId: z.string().uuid(),
        }),
        querystring: z.object({
          pageIndex: z.string().nullish().default("0").transform(Number),
          query: z.string().nullish(),
        }),
        response: {
          200: z.object({
            attendees: z.array(
              z.object({
                id: z.number().int(),
                name: z.string(),
                email: z.string(),
                createdAt: z.date(),
                checkedInAt: z.date().nullable(),
              })
            ),
          }),
          400: z.object({
            message: z.string(),
            errors: z.object({
              title: z.array(z.string()),
            }),
          }),
        },
      },
    },
    async (req, res) => {
      const { eventId } = req.params;
      const { pageIndex, query } = req.query;

      const attendees = await prisma.attendee.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          checkIn: {
            select: {
              createdAt: true,
            },
          },
        },
        where: query
          ? {
              eventId,
              name: {
                contains: query,
              },
            }
          : {
              eventId,
            },
        take: 10,
        skip: pageIndex * 10,
        orderBy: { createdAt: "desc" },
      });

      if (attendees === null) throw new NotFound("Invalid eventId");
      return res.send({
        attendees: attendees.map((attendee) => {
          return {
            id: attendee.id,
            name: attendee.name,
            email: attendee.email,
            createdAt: attendee.createdAt,
            checkedInAt: attendee.checkIn?.createdAt ?? null,
          };
        }),
      });
    }
  );
}
