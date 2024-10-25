import { z } from "zod";

export const matchQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  championshipSeason: z.string(),
  status: z.enum(["agendado", "finalizado"]).refine((value) => value, {
    message: 'Status must be one of: "agendado", "finalizado".',
  }),
  team1: z.string().optional(),
  team2: z.string().optional(),
});
