import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { generateSlug } from "../utils/generateSlug";
import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { Conflict } from "./_errors/conflict";

export async function createEvent(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/events",
    {
      schema: {
        summary: "Create an event",
        tags: ["events"],
        body: z.object({
          title: z.string().min(4),
          details: z.string().nullable(),
          maximumAttendees: z.number().int().positive().nullable(),
        }),
        response: {
          201: z.object({
            eventId: z.string().uuid(),
          }),
          400: z.object({
            message: z.string(),
            errors: z.object({
              title: z.array(z.string()),
            }),
          }),
          409: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (req, res) => {
      const { title, details, maximumAttendees } = req.body;

      const slug = generateSlug(title);

      const eventWithSameSlug = await prisma.event.findUnique({
        where: {
          slug,
        },
      });

      if (eventWithSameSlug !== null) {
        throw new Conflict("Another event with same title already exists");
      }

      const event = await prisma.event.create({
        data: {
          title,
          details,
          maximumAttendees,
          slug,
        },
      });

      return res.status(201).send({ eventId: event.id });
    }
  );
}
