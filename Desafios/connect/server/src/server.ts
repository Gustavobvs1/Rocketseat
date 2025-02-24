import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastify from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { env } from "./env";
import { accessInviteLinkRoute } from "./routes/access-invite-link-route";
import { getRankingRoute } from "./routes/get-ranking-route";
import { getSubscriberInvitesClicksRoute } from "./routes/get-subscriber-invites-clicks-route";
import { getSubscriberInvitesCountRoute } from "./routes/get-subscriber-invites-count-route";
import { getSubscriberRankingPositionRoute } from "./routes/get-subscriber-ranking-position-route";
import { subscribeToEventRoute } from "./routes/subscribe-to-event-route";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors);

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "NLW Connect",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

app.register(subscribeToEventRoute);
app.register(accessInviteLinkRoute);
app.register(getSubscriberInvitesClicksRoute);
app.register(getSubscriberInvitesCountRoute);
app.register(getSubscriberRankingPositionRoute);
app.register(getRankingRoute);

app
  .listen({ port: env.PORT })
  .then(() => console.log("listening on port " + env.PORT));
