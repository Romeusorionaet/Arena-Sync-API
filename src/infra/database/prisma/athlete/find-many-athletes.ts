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
    skip: (page - 1) * 10,
    take: 10,
  });

  return athletes.length > 0 ? athletes : [];
}
