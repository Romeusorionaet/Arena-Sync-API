import { createSlugFilter } from "src/infra/utils/create-slug-filter";
import { prisma } from "src/infra/services/prisma";

interface FindManyMatchesProps {
  page: number;
  championshipSeason: string;
  status: "agendado" | "finalizado";
  team1?: string;
  team2?: string;
}

type MatchResult = {
  id: string;
  dataRealizacaoIso: string;
  estadio: string | null;
  placar: string | null;
  placarMandante: number | null;
  placarVisitante: number | null;
  status: string;
  timeMandante: {
    escudo: string;
    sigla: string;
  };
  timeVisitante: {
    escudo: string;
    sigla: string;
  };
};

export async function findManyMatches({
  championshipSeason,
  page,
  status,
  team1,
  team2,
}: FindManyMatchesProps): Promise<MatchResult[] | []> {
  const currentDate = new Date().toISOString();

  const dateFilter =
    status === "agendado" ? { gte: currentDate } : { lte: currentDate };

  const matches = await prisma.partida.findMany({
    where: {
      campeonato: { temporada: championshipSeason },
      status,
      dataRealizacaoIso: dateFilter,
      ...createSlugFilter(team1, team2),
    },
    select: {
      id: true,
      dataRealizacaoIso: true,
      estadio: true,
      placar: true,
      placarMandante: true,
      placarVisitante: true,
      status: true,
      timeMandante: {
        select: {
          escudo: true,
          sigla: true,
        },
      },
      timeVisitante: {
        select: {
          escudo: true,
          sigla: true,
        },
      },
    },
    orderBy: {
      dataRealizacaoIso: status === "agendado" ? "asc" : "desc",
    },
    skip: (page - 1) * 10,
    take: 10,
  });

  return matches.length > 0 ? matches : [];
}
