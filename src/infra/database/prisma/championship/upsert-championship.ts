import { championshipSchema } from "src/infra/http/schemas/championship-schema";
import { prisma } from "src/infra/services/prisma";
import { z } from "zod";

type championshipData = z.infer<typeof championshipSchema>;

export async function upsertChampionship(
  data: championshipData,
): Promise<{ id: string }> {
  const championship = await prisma.campeonato.upsert({
    where: {
      temporada: data.edicao_atual.temporada,
    },
    update: {},
    create: {
      id: data.campeonato_id.toString(),
      nome: data.nome,
      slug: data.slug,
      logo: data.logo,
      status: data.status,
      temporada: data.edicao_atual.temporada,
      rodadaAtual: Number(data.rodada_atual.rodada),
    },
  });

  return { id: championship.id };
}
