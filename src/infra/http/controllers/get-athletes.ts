import { FastifyRequest, FastifyReply } from "fastify";
import { findManyAthletes } from "src/infra/database/prisma/athlete/find-many-athletes";

export async function getAthletes(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const athletes = await findManyAthletes();

    if (athletes.length === 0) {
      return reply.status(200).send({
        message: "No athletes found.",
        athletes: [],
      });
    }

    return reply.status(200).send({
      times: athletes,
    });
  } catch (err) {
    console.error("Error fetching athletes:", err);

    return reply.status(500).send({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}
