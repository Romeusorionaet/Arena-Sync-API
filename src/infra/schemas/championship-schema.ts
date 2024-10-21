import { z } from "zod";

export const championshipSchema = z.object({
  championship_id: z.string(),
  name: z.string(),
  slug: z.string(),
  season: z.string(),
  status: z.string(),
  logo: z.string(),
  current_round: z.string(),
});
