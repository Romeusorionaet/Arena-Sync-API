import { z } from "zod";

const teamSchema = z.object({
  time_id: z.number(),
  nome_popular: z.string(),
  sigla: z.string(),
  escudo: z.string(),
});

export const matchSchema = z.object({
  partida_id: z.coerce.number(),
  time_mandante: teamSchema,
  time_visitante: teamSchema,
  status: z.string(),
  slug: z.string(),
  data_realizacao_iso: z.string().nullable(),
});

const rodadasSchema = z.object(
  Array.from({ length: 38 }, (_, index) => `${index + 1}a-rodada`).reduce(
    (acc, rodada) => {
      acc[rodada] = z.array(matchSchema);
      return acc;
    },
    {} as Record<string, z.ZodArray<typeof matchSchema>>,
  ),
);

export const matchesListSchema = z.object({
  partidas: z.object({
    "fase-unica": rodadasSchema,
  }),
});
