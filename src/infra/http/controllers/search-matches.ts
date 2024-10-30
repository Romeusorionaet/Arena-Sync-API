import { findManyMatches } from "src/infra/database/prisma/match/find-many-matches";
import { matchQuerySchema } from "../schemas/match-query-schema";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function searchMatches(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { page, championshipSeason, status, team1, team2 } =
      matchQuerySchema.parse(request.query);

    const matches = await findManyMatches({
      page,
      championshipSeason,
      status,
      team1,
      team2,
    });

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
