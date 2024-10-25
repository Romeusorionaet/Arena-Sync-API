import { findMatchDetails } from "src/infra/database/prisma/match/find-match-details";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

const paramsSchema = z.object({
  matchId: z.string(),
});

export async function matchDetails(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { matchId } = paramsSchema.parse(request.params);

    const match = await findMatchDetails(matchId);

    if (!match) {
      return reply.status(200).send({
        message: "Match not found.",
        match: null,
      });
    }

    return reply.status(200).send({
      partida: match,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(400).send({
        error: err.errors[0].message,
        error_path: err.errors[0].path,
      });
    } else {
      console.error("Error fetching match:", err);

      return reply.status(500).send({
        error: "Internal Server Error",
        message: "An unexpected error occurred.",
      });
    }
  }
}
