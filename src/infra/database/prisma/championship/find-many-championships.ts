import { prisma } from "src/infra/services/prisma";

export async function findManyChampionships(): Promise<
  { temporada: string }[] | []
> {
  const championships = await prisma.campeonato.findMany({
    select: {
      temporada: true,
    },
  });

  if (championships.length === 0) {
    return [];
  }

  return championships;
}
