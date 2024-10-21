import {
  fetchChampionshipData,
  fetchChampionshipMatches,
} from "../services/soccer-api";
import {
  createChampionship,
  findExistingChampionship,
  upsertMatchData,
} from "../database/prisma/prisma-championship-service-repository";
import { FastifyReply } from "fastify";

export async function saveChampionshipMatches(reply: FastifyReply) {
  try {
    const responseChampionship = await fetchChampionshipData();

    const existingChampionship = await findExistingChampionship(
      responseChampionship.edicao_atual.temporada,
    );

    if (existingChampionship) {
      return reply.status(409).send({
        error_code: "SEASON_EXISTS",
        message_error:
          "A temporada já existe. Aguarde o início de uma nova temporada para realizar esta operação.",
      });
    }

    const championship = await createChampionship(responseChampionship);

    const dataMatches = await fetchChampionshipMatches();

    if (!dataMatches.partidas || !dataMatches.partidas["fase-unica"]) {
      return reply.status(500).send({
        error_code: "INVALID_DATA_STRUCTURE",
        message_error: "Estrutura de dados inesperada da API.",
      });
    }

    const matches = dataMatches.partidas["fase-unica"];

    await upsertMatchData(matches, championship.id);

    return reply.status(201).send({
      message_error: "Dados do campeonato salvos com sucesso!",
    });
  } catch (err) {
    return reply.status(500).send({
      error_code: "SAVE_ERROR",
      message_error: "Erro ao salvar dados do campeonato.",
    });
  }
}
