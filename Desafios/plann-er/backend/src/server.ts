import cors from "@fastify/cors";
import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";
import { confirmParticipant } from "./routes/confirm-participant";
import { confirmTrip } from "./routes/confirm-trip";
import { createActivity } from "./routes/create-activity";
import { createLink } from "./routes/create-link";
import { createTrip } from "./routes/create-trip";
import { getActivities } from "./routes/get-activities";
import { getLinks } from "./routes/get-links";
import { getParticipants } from "./routes/get-participants";
import { createInvite } from "./routes/create-invite";
import { updateTrip } from "./routes/update-trip";
import { getTripDetails } from "./routes/get-trip-details";
import { getParticipant } from "./routes/get-participant";
import { errorHandler } from "./error-handler";
import { env } from "./env";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(cors, {
  origin: "*",
});

app.register(fastifySwagger, {
  swagger: {
    consumes: ["application/json"],
    produces: ["application/json"],
    info: {
      title: "plann.er",
      description: "Plann.er API documentation",
      version: "1.0",
    },
    schemes: ["http"],
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

app.setErrorHandler(errorHandler);

//Viagens
app.register(createTrip);
app.register(confirmTrip);
app.register(confirmParticipant);
app.register(updateTrip);
app.register(getTripDetails);

//Atividades
app.register(createActivity);
app.register(getActivities);

//Links
app.register(createLink);
app.register(getLinks);

//Participantes
app.register(getParticipants);
app.register(getParticipant);
app.register(createInvite);

app.listen({ port: env.PORT }).then(() => {
  console.log(`listening on port ${env.PORT}`);
});
