import { Prisma } from "@prisma/client";
import { prisma } from "src/infra/services/prisma";

export async function findManyTeams(
  page: number,
): Promise<Prisma.TimeUncheckedCreateInput[] | []> {
  const teams = await prisma.time.findMany({
    skip: (page - 1) * 30,
    take: 30,
  });

  return teams.length > 0 ? teams : [];
}
