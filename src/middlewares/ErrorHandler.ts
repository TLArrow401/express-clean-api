import type { Request, Response, NextFunction } from "express";
/**
 * Clase personalizada para errores extendida de la clase Error nativa de js
 */
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
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
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error(err); // Para desarrollo, en producción usar un logger profesional

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  // Error inesperado
  return res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
};
