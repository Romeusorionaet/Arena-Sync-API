import { matchSchema } from "src/infra/http/schemas/matches-list-schema";
import { prisma } from "src/infra/services/prisma";
import { z } from "zod";

type matchesListData = z.infer<typeof matchSchema>;

export async function upsertMatchData(
  matches: matchesListData[],
  championshipId: string,
): Promise<void> {
  for (const match of matches) {
    const {
      partida_id,
      time_mandante,
      time_visitante,
      status,
      slug,
      data_realizacao_iso,
    } = match;

    const mandante = await prisma.time.upsert({
      where: { id: time_mandante.time_id.toString() },
      update: {},
      create: {
        id: time_mandante.time_id.toString(),
        nome: time_mandante.nome_popular,
        sigla: time_mandante.sigla,
        escudo: time_mandante.escudo,
      },
    });

    const visitante = await prisma.time.upsert({
      where: { id: time_visitante.time_id.toString() },
      update: {},
      create: {
        id: time_visitante.time_id.toString(),
        nome: time_visitante.nome_popular,
        sigla: time_visitante.sigla,
        escudo: time_visitante.escudo,
      },
    });

    await prisma.partida.upsert({
      where: { id: partida_id.toString() },
      update: {},
      create: {
        id: partida_id.toString(),
        campeonatoId: championshipId,
        status,
        slug,
        dataRealizacaoIso: data_realizacao_iso ?? "Jogo anulado",
        timeMandanteId: mandante.id,
        timeVisitanteId: visitante.id,
      },
    });
  }
}
