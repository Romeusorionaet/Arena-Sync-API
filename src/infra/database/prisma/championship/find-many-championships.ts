import { prisma } from "src/infra/services/prisma";
import { Prisma } from ".prisma/client";

export async function findManyChampionships(): Promise<
  Prisma.CampeonatoUncheckedCreateInput[] | []
> {
  const championships = await prisma.campeonato.findMany();

  if (championships.length === 0) {
    return [];
  }

  return championships;
}
