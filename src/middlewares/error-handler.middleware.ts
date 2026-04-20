import type { Request, Response, NextFunction } from "express";
import { ZodError, z } from "zod";
import { logger } from "../config/logger.js";
import { Env } from "../config/env.js";

const isDev = Env.NODE_ENV === "dev";

/**
 * Clase personalizada para errores extendida de la clase Error nativa de js
 */
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public details?: unknown;

  constructor(
    message: string,
    statusCode = 500,
    isOperational = true,
    details?: unknown,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 *
 * @param err mensajes de error al desarrolador
 * @param res mensajes de error al cliente
 * @returns mensajes al cliente con status y informacion segun sea prod o devs
 */
export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // Faltante logica para manejar errores segun Env (desarrollo vs produccion)
  console.error(err); // Para desarrollo, en producción usar un logger profesional

  // Errores de validacion segun zod
  if (err instanceof ZodError) {
    const formatted = z.flattenError(err);

    req.log.warn(
      {
        type: "validation_error",
        errors: formatted.fieldErrors,
      },
      "Error de validacion (Zod)",
    );

    return res.status(400).json({
      status: "fail",
      message: "Error en validacion de datos",
      ...(isDev ? { errors: formatted.fieldErrors } : {}),
    });
  }

  // Errores de validacion segun app
  if (err instanceof AppError) {
    const logType = err.isOperational ? "warn" : "error";
    req.log[logType](
      {
        type: err.isOperational ? "operational_error" : "critical_error",
        message: err.message,
        // Detalles solo en dev
        details: isDev ? err.details : undefined,
      },
      err.isOperational ? "Error operacional" : "Error critico",
    );

    return res.status(err.isOperational ? err.statusCode : 500).json({
      status: "error",
      message: err.isOperational
        ? err.message
        : "Internal critical server error",
      // Detalles solo en dev
      ...(isDev && err.details ? { errors: err.details } : {}),
    });
  }

  // Errores desconocidos
  req.log.error(
    {
      type: "unknown_error",
      err,
      stack: isDev ? (err as Error).stack : undefined,
    },
    "Error no controlado",
  );

  // Error inesperado
  return res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
};
