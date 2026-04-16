import type { Request, Response, NextFunction } from "express";
import { ZodError, z } from "zod";
import { logger } from "../config/logger.js";
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
      errors: formatted.fieldErrors,
    });
  }

  // Errores de validacion segun app
  if (err instanceof AppError) {
    // Errores no operacionales
    if (!err.isOperational) {
      req.log.error(
        {
          type: "critical_error",
          err,
          details: err.details,
        },
        "Error critico no operacional",
      );

      return res.status(500).json({
        status: "error",
        message: "Internal critical server error",
      });
    }
    // Errores operacionales
    req.log.warn(
      {
        type: "operational_error",
        message: err.message,
        details: err.details,
      },
      "Error operacional",
    );

    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
      ...(err.details ? { errors: err.details } : {}),
    });
  }

  req.log.error(
    {
      type: "unknown_error",
      err,
    },
    "Error no controlado",
  );

  // Error inesperado
  return res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
};
