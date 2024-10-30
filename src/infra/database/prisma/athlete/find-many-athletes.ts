import { prisma } from "src/infra/services/prisma";
import { Prisma } from "@prisma/client";

export async function findManyAthletes(
  page: number,
): Promise<Prisma.AtletaUncheckedCreateInput[] | []> {
  const athletes = await prisma.atleta.findMany({
    select: {
      id: true,
      nomePopular: true,
    },
    skip: (page - 1) * 30,
    take: 30,
  });

  return athletes.length > 0 ? athletes : [];
}
