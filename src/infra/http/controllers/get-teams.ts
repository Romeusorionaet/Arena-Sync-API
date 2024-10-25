import { FastifyRequest, FastifyReply } from "fastify";
import { findManyTeams } from "src/infra/database/prisma/teams/find-many-Teams";

export async function getTeams(request: FastifyRequest, reply: FastifyReply) {
  try {
    const teams = await findManyTeams();

    if (teams.length === 0) {
      return reply.status(200).send({
        message: "No championship found.",
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
