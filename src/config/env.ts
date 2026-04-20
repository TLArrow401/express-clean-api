import dotenv from "dotenv/config";
import { z } from "zod";
import {logger} from "./logger.js";

const EnvSchema = z.object({
  PORT: z
    .string()
    .transform((val) => Number(val))
    .default(3000), 
  NODE_ENV: z.enum(["dev", "prod", "test"]).default("dev"),
  DB_HOST: z.string().default("localhost"),
  DB_PORT: z
    .string()
    .transform((val) => Number(val))
    .default(5432),
  DB_NAME: z.string().min(1, "DB_NAME is required"),
  DB_USER: z.string().min(1, "DB_USER is required"),
  DB_PASS: z.string().min(1, "DB_PASS is required"),
});


const parsedEnv = EnvSchema.safeParse(process.env);

if(!parsedEnv.success){
  logger.error(
    { errors: parsedEnv.error.issues },
    "Invalid environment variables"
  );
  // Cerrar la app si hay errores criticos 1 y si la salida es exitosa 0
  process.exit(1);
}

interface EnvTypes {
  PORT: number;
  NODE_ENV: "dev" | "prod" | "test";
  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_USER: string;
  DB_PASS: string;
}

export const Env: EnvTypes = parsedEnv.data;

/* export const Env: EnvSchema = {
  // Variables de entorno
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: isDev as EnvSchema["NODE_ENV"],

  // Variables de bd
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_PORT: Number(process.env.DB_PORT) || 5432,
  DB_NAME: process.env.DB_NAME || "",
  DB_USER: process.env.DB_USER || "",
  DB_PASS: process.env.DB_PASS || "",
};
 */