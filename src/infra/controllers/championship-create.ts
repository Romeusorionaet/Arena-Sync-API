import { FastifyRequest, FastifyReply } from "fastify";
import {
  fetchChampionshipData,
  fetchChampionshipMatches,
} from "../services/soccer-api";
import {
  createChampionship,
  findExistingChampionship,
  upsertMatchData,
} from "../database/prisma/prisma-championship-service-repository";

export async function accessChampionshipMatches(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const responseChampionship = await fetchChampionshipData();

    const campeonatoExistente = await findExistingChampionship(
      responseChampionship.edicao_atual.temporada,
    );

    if (campeonatoExistente) {
      return reply.status(409).send({
        message:
          "A temporada já existe. Aguarde o início de uma nova temporada para realizar esta operação.",
      });
    }

    const championship = await createChampionship(responseChampionship);

    const dataMatches = await fetchChampionshipMatches();

    if (!dataMatches.partidas || !dataMatches.partidas["fase-unica"]) {
      return reply
        .status(500)
        .send({ message: "Estrutura de dados inesperada da API" });
    }

    const matches = dataMatches.partidas["fase-unica"];

    await upsertMatchData(matches, championship.id);

    return reply
      .status(201)
      .send({ message: "Dados do campeonato salvos com sucesso!" });
  } catch (err) {
    console.error("Erro ao salvar dados do campeonato:", err);
    return reply
      .status(500)
      .send({ message: "Erro ao salvar dados do campeonato." });
  }
}
