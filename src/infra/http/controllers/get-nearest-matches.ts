import { FastifyRequest, FastifyReply } from "fastify";
import { findManyNearestMatches } from "src/infra/database/prisma/match/find-many-nearest-matches";
import { z } from "zod";

const querySchema = z.object({
  season: z.string(),
});

export async function getNearestMatches(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { season } = querySchema.parse(request.query);

    const matches = await findManyNearestMatches(season);

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
      console.error("Error fetching matches:", err);

      return reply.status(500).send({
        error: "Internal Server Error",
        message: "An unexpected error occurred.",
      });
    }
  }
}
