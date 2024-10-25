import { findManyChampionships } from "src/infra/database/prisma/championship/find-many-championships";
import { FastifyRequest, FastifyReply } from "fastify";

export async function championship(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const championships = await findManyChampionships();

    if (championships.length === 0) {
      return reply.status(200).send({
        message: "No championship found.",
        championships: [],
      });
    }

    return reply.status(200).send({
      campeonato: championships,
    });
  } catch (err) {
    console.error("Error fetching championships:", err);

    return reply.status(500).send({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}
