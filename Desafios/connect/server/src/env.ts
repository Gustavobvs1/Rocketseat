import z from "zod";
import dotenv from "dotenv";
dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string(),
  REDIS_URL: z.string().url(),
  WEB_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
