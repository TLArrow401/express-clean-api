import type { Request, Response, NextFunction } from "express";
import { type ZodType, ZodError } from "zod";
import { AppError } from "./error-handler.middleware.js";

/**
 *
 */

export default function ValidateRequest<T, K extends "body" | "params" | "query">(
  schema: ZodType<T>,
  property: K = "body" as K,
) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsedData: T = schema.parse(req[property]);
      (req[property] as unknown) = parsedData;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        next(new AppError(
          "Invalid request data", 
          400,
          true,
          err.format()
        ));
      }
      next(err);
    }
  };
}
