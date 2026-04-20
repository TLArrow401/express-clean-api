// Punto de acceso y configuracion del servidor
import Database from "./config/database.js";
import { createApp } from "./app.js";
import {logger } from "./config/logger.js";
import { Env } from "./config/env.js";

const StartServer = async (): Promise<void> => {
  try {
    // Crear aplicacion
    const app = createApp();
    // Inicializar la conexion a la base de datos
    Database.getInstance();
    // Iniciar servidor
    app.listen(Env.PORT, () => {
      logger.info(`Server running on port http://localhost:${Env.PORT}`);
    })
  } catch (error) {
    logger.error({ error }, "Error starting server:");
  }
}

StartServer();
