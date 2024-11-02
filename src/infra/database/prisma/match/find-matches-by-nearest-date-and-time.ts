import { prisma } from "src/infra/services/prisma";
import dayjs from "dayjs";

export async function findMatchesByNearestDateAndTime(): Promise<
  { id: string }[]
> {
  const startOfYesterday = dayjs()
    .subtract(1, "day")
    .startOf("day")
    .format("YYYY-MM-DDTHH:mm:ss");
  const endOfYesterday = dayjs()
    .subtract(1, "day")
    .endOf("day")
    .format("YYYY-MM-DDTHH:mm:ss");

  const data = await prisma.partida.findMany({
    where: {
      status: "agendado",
      dataRealizacaoIso: {
        gte: startOfYesterday,
        lt: endOfYesterday,
      },
    },
    select: {
      id: true,
    },
  });

  return data || [];
}
