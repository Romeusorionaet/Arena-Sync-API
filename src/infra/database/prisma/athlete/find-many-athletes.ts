import { prisma } from "src/infra/services/prisma";
import { Prisma } from "@prisma/client";

export async function findManyAthletes(): Promise<
  Prisma.AtletaUncheckedCreateInput[] | []
> {
  const atletas = await prisma.atleta.findMany({
    select: {
      id: true,
      nomePopular: true,
    },
  });

  return atletas.length > 0 ? atletas : [];
}
