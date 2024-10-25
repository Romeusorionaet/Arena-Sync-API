import { prisma } from "src/infra/services/prisma";
import dayjs from "dayjs";

export async function findMatchesByNearestDateAndTime(): Promise<
  { id: string }[]
> {
  const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");

  const data = await prisma.partida.findMany({
    where: {
      status: "finalizado",
      dataRealizacaoIso: {
        gte: `${yesterday}T00:00:00`,
        lt: `${yesterday}T23:59:59`,
      },
    },
    select: {
      id: true,
    },
  });

  return data || [];
}
