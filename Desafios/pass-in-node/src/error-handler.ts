import { FastifyInstance } from "fastify";
import { BadRequest } from "./routes/_errors/bad-request";
import { Conflict } from "./routes/_errors/conflict";
import { NotFound } from "./routes/_errors/not-found";
import { ZodError } from "zod";
import { Forbidden } from "./routes/_errors/forbidden";

type FastifyErrorHandler = FastifyInstance["errorHandler"];

export const errorHandler: FastifyErrorHandler = (err, req, res) => {
  if (err instanceof ZodError) {
    return res.status(400).send({
      message: "Error during validation",
      errors: err.flatten().fieldErrors,
    });
  }
  if (err instanceof BadRequest) {
    return res.status(400).send({ message: err.message });
  }

  if (err instanceof Conflict) {
    return res.status(409).send({ message: err.message });
  }

  if (err instanceof NotFound) {
    return res.status(404).send({ message: err.message });
  }

  if (err instanceof Forbidden) {
    return res.status(403).send({ message: err.message });
  }

  return res.status(500).send({ message: "Internal server error" });
};
