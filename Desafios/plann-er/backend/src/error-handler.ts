import { FastifyInstance } from "fastify";
import { ClientError } from "./errors/client-error";
import { ZodError } from "zod";

type FastifyErrorHandler = FastifyInstance["errorHandler"];

export const errorHandler: FastifyErrorHandler = (error, req, res) => {
  if (error instanceof ClientError) {
    return res.status(400).send({
      message: error.message,
    });
  } else if (error instanceof ZodError) {
    return res.status(400).send({
      message: "Invalid Input",
      errors: error.flatten().fieldErrors,
    });
  }
};
