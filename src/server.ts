// Punto de acceso y configuracion del servidor
import { createApp } from "./app.js";
import Database from "./config/database.js";
import { Env } from "./config/env.js";

const StartServer = async (): Promise<void> => {
  try {
    // Crear aplicacion
    const app = createApp();
    // Inicializar la conexion a la base de datos
    Database.getInstance();
    // Iniciar servidor
    app.listen(Env.PORT, () => {
      console.log(`Server running on port http://localhost:${Env.PORT}`);
    })
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

StartServer();
