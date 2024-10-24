import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { getChampionships } from "../database/prisma/prisma-championship-service-repository";

export async function championship(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const championships = await getChampionships();

    if (championships.length === 0) {
      return reply.status(200).send({
        message: "No championship found.",
        products: [],
      });
    }

    return reply.status(200).send({
      championships,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(400).send({
        error: err.errors[0].message,
        error_path: err.errors[0].path,
      });
    }
  }
}
