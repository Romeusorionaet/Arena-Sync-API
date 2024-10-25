import { createSlugFilter } from "src/infra/utils/create-slug-filter";
import { prisma } from "src/infra/services/prisma";
import { Prisma } from "@prisma/client";

interface FindManyMatchesProps {
  page: number;
  championshipSeason: string;
  status: "agendado" | "finalizado";
  team1?: string;
  team2?: string;
}

export async function findManyMatches({
  championshipSeason,
  page,
  status,
  team1,
  team2,
}: FindManyMatchesProps): Promise<Prisma.PartidaUncheckedCreateInput[] | []> {
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
    orderBy: {
      dataRealizacaoIso: status === "agendado" ? "asc" : "desc",
    },
    skip: (page - 1) * 10,
    take: 10,
  });

  return matches.length > 0 ? matches : [];
}
