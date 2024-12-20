import { prisma } from "src/infra/services/prisma";

export async function findManyNearestMatches(season: string) {
  const today = new Date();
  const todayStart = today.toISOString().split("T")[0] + "T00:00:00.000Z";

  const threeDaysLater = new Date(today);
  threeDaysLater.setDate(today.getDate() + 3);
  const threeDaysEnd =
    threeDaysLater.toISOString().split("T")[0] + "T23:59:59.999Z";

  const matches = await prisma.partida.findMany({
    where: {
      campeonato: {
        temporada: season,
      },
      status: "agendado",
      dataRealizacaoIso: {
        gte: todayStart,
        lte: threeDaysEnd,
      },
    },
    select: {
      dataRealizacaoIso: true,
      timeMandante: {
        select: {
          escudo: true,
          nome: true,
        },
      },
      timeVisitante: {
        select: {
          escudo: true,
          nome: true,
        },
      },
    },
    orderBy: {
      dataRealizacaoIso: "asc",
    },
  });

  return matches;
}
