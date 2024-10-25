import { findManyAthletes } from "src/infra/database/prisma/athlete/find-many-athletes";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
});

export async function getAthletes(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { page } = querySchema.parse(request.query);

    const athletes = await findManyAthletes(page);

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
