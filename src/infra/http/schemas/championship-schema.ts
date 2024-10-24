import { z } from "zod";

export const championshipSchema = z.object({
  campeonato_id: z.coerce.number(),
  nome: z.string(),
  slug: z.string(),
  status: z.string(),
  logo: z.string(),
  edicao_atual: z.object({
    temporada: z.string(),
  }),
  rodada_atual: z.object({
    rodada: z.coerce.number(),
  }),
});
