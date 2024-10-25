import { findTeamDetails } from "src/infra/database/prisma/team/find-team-details";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

const paramsSchema = z.object({
  teamId: z.string(),
});

export async function getTeamDetails(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { teamId } = paramsSchema.parse(request.params);

    const team = await findTeamDetails(teamId);

    if (!team) {
      return reply.status(200).send({
        message: "Team not found.",
        team: null,
      });
    }

    return reply.status(200).send({
      time: team,
    });
  } catch (err) {
    console.error("Error fetching team:", err);

    return reply.status(500).send({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}
