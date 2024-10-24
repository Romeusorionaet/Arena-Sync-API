import { Prisma } from ".prisma/client";
import { championshipSchema } from "src/infra/schemas/championship-schema";
import { matchSchema } from "src/infra/schemas/matches-list-schema";
import { prisma } from "src/infra/services/prisma";
import { z } from "zod";

type championshipData = z.infer<typeof championshipSchema>;

export async function upsertChampionship(
  data: championshipData,
): Promise<{ id: string }> {
  const championship = await prisma.campeonato.upsert({
    where: {
      temporada: data.edicao_atual.temporada,
    },
    update: {},
    create: {
      id: data.campeonato_id.toString(),
      nome: data.nome,
      slug: data.slug,
      logo: data.logo,
      status: data.status,
      temporada: data.edicao_atual.temporada,
      rodadaAtual: Number(data.rodada_atual.rodada),
    },
  });

  return { id: championship.id };
}

export async function getChampionships(): Promise<
  Prisma.CampeonatoUncheckedCreateInput[] | []
> {
  const championships = await prisma.campeonato.findMany();

  if (championships.length === 0) {
    return [];
  }

  return championships;
}

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
