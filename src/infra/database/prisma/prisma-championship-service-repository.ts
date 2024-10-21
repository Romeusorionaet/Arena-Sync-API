/* eslint-disable camelcase */

import { prisma } from "src/infra/services/prisma";

export async function findExistingChampionship(temporada: string) {
  return prisma.campeonato.findUnique({
    where: {
      temporada: temporada.toString(),
    },
  });
}

export async function createChampionship(data: any) {
  return prisma.campeonato.create({
    data: {
      id: data.campeonato_id.toString(),
      nome: data.nome,
      slug: data.slug,
      logo: data.logo,
      status: data.status,
      temporada: data.edicao_atual.temporada,
      rodadaAtual: data.rodada_atual.rodada,
    },
  });
}

export async function upsertMatchData(matches: any[], championshipId: string) {
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
        slug: time_mandante.sigla,
        escudo: time_mandante.escudo,
      },
    });

    const visitante = await prisma.time.upsert({
      where: { id: time_visitante.time_id.toString() },
      update: {},
      create: {
        id: time_visitante.time_id.toString(),
        nome: time_visitante.nome_popular,
        slug: time_visitante.sigla,
        escudo: time_visitante.escudo,
      },
    });

    await prisma.partida.create({
      data: {
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
