import { Prisma } from "@prisma/client";
import { prisma } from "src/infra/services/prisma";

export async function findManyTeams(): Promise<
  Prisma.TimeUncheckedCreateInput[] | []
> {
  const teams = await prisma.time.findMany();

  return teams.length > 0 ? teams : [];
}
