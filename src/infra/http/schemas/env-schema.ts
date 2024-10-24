import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "test", "production"]).default("dev"),
  PORT: z.coerce.number().optional().default(3333),
  SOCCER_API_KEY: z.string(),
});
