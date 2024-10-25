import { championshipRoutes } from "./http/routes/routes";
import CORS from "@fastify/cors";
import { ZodError } from "zod";
import fastify from "fastify";
import { env } from "./env";

export const app = fastify();

app.register(CORS, {
  origin: "*",
});

app.register(championshipRoutes);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: "Validation error.", issues: error.format() });
  }

  if (env.NODE_ENV !== "production") {
    console.error(error);
  } else {
    console.error(error.message);
  }

  return reply.status(500).send({ message: "Internal server error." });
});
