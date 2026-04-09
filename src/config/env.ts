import dotenv from "dotenv/config";

const isDev = process.env.NODE_ENV || "dev";

interface EnvSchema {
  PORT: number;
  NODE_ENV: "dev" | "prod" | "test";
  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_USER: string;
  DB_PASS: string;
}

export const Env: EnvSchema = {
  // Variables de entorno
  PORT:     Number(process.env.PORT) || 3000,
  NODE_ENV: isDev as EnvSchema["NODE_ENV"],

  // Variables de bd
  DB_HOST:  process.env.DB_HOST || "localhost",
  DB_PORT:  Number(process.env.DB_PORT) || 5432,
  DB_NAME:  process.env.DB_NAME || "",
  DB_USER:  process.env.DB_USER || "",
  DB_PASS:  process.env.DB_PASS || "",
}