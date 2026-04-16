import pino from "pino";
import { Env } from "./env.js";
import {pinoHttp} from "pino-http";

const isProd = Env.NODE_ENV === "prod";

function buildLogger(){
  return pino({
    // Nivel de log
    level: isProd ? "info":"debug",
    // Configuracion de transporte de datos
    ...(isProd ? {} : {
      transport:{
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        }
      }
    }),
    // Informacion adicional que se agrega a cada log
    base: { env: process.env.NODE_ENV},
    // Formato de timestamp
    timestamp: pino.stdTimeFunctions.isoTime,
  });
};

export const logger = buildLogger();
export const httpLogger = pinoHttp({logger});

export function getLogger(moduleName: string){
  return logger.child({ module: moduleName });
};
