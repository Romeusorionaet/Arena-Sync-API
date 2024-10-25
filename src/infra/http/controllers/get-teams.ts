import { findManyTeams } from "src/infra/database/prisma/team/find-many-teams";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
});

export async function getTeams(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { page } = querySchema.parse(request.query);

    const teams = await findManyTeams(page);

    if (teams.length === 0) {
      return reply.status(200).send({
        message: "No teams found.",
        teams: [],
      });
    }

    return reply.status(200).send({
      times: teams,
    });
  } catch (err) {
    console.error("Error fetching teams:", err);

    return reply.status(500).send({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}
