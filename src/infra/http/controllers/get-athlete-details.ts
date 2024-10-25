import { findAthleteDetails } from "src/infra/database/prisma/athlete/find-athlete-details";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

const paramsSchema = z.object({
  athleteId: z.string(),
});

export async function getAthleteDetails(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { athleteId } = paramsSchema.parse(request.params);

    const athlete = await findAthleteDetails(athleteId);

    if (!athlete) {
      return reply.status(200).send({
        message: "Athlete not found.",
        athlete: null,
      });
    }

    return reply.status(200).send({
      atleta: athlete,
    });
  } catch (err) {
    console.error("Error fetching athlete:", err);

    return reply.status(500).send({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}
