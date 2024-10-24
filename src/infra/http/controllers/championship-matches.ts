import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { matchQuerySchema } from "../schemas/match-query-schema";
import { findManyMatches } from "../../database/prisma/prisma-match-repository";

export async function championshipMatches(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { page, championshipSeason, status } = matchQuerySchema.parse(
      request.query,
    );

    const matches = await findManyMatches(page, championshipSeason, status);

    if (matches.length === 0) {
      return reply.status(200).send({
        message: "No match found.",
        matches: [],
      });
    }

    return reply.status(200).send({
      partidas: matches,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(400).send({
        error: err.errors[0].message,
        error_path: err.errors[0].path,
      });
    } else {
      console.error("Error fetching championships:", err);

      return reply.status(500).send({
        error: "Internal Server Error",
        message: "An unexpected error occurred.",
      });
    }
  }
}
