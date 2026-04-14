// Rutas, seguridad, middlewares
import express, { type Request, type Response, type Application } from "express";
import helmet from "helmet";
import { errorHandler } from "./middlewares/error-handler.middleware.js";
import cors from "cors";
// Rutas
import userRoutes from "./routes/user.routes.js";

export const createApp = (): Application => {
  const app = express();
  app.use(cors());

  // lector de datos a json
  app.use(express.json());
  // Proteccion de seguridad cabezeras
  app.use(helmet());

  //Primera ruta 
  app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Welcome to the API" });
  });

  // Rutas de usuarios
  app.use("/users", userRoutes);

  // Middleware de manejo de errores
  app.use(errorHandler);

  return app;
}