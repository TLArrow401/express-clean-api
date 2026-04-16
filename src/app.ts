// Rutas, seguridad, middlewares
import express, {
  type Request,
  type Response,
  type Application,
} from "express";
import { errorHandler } from "./middlewares/error-handler.middleware.js";
import { logger, httpLogger } from "./config/logger.js";

import helmet from "helmet";
import cors from "cors";
// Rutas
import userRoutes from "./routes/user.routes.js";

export const createApp = (): Application => {
  const app = express();
  app.use(cors());

  // Logger de peticiones HTTP
  app.use(httpLogger);
  
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
};
