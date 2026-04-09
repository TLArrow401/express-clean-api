import { Pool } from "pg";
import { Env } from "./env.js";

type QueryArgs = [string, unknown[]?];

export default class Database {
  // Esta variable almacena la propia instancia de la clase.
  private static instance: Database;
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: Env.DB_HOST,
      port: Number(Env.DB_PORT),
      database: Env.DB_NAME,
      user: Env.DB_USER,
      password: Env.DB_PASS,
    });
  }

  public static getInstance = (): Database => {
    // validacion la conexion no se haya creado antes
    if (!Database.instance) {
      Database.instance = new Database();
      console.log("Se ha realizado la conexion: ✅");
      
    }
    return Database.instance;
  }

  // Metodo de ejecucion de consultas (Modularidad)
  // QueryArgs es un tipo tupla que define el formato de los argumentos.
  // ...operador spread (...)
  // T es un marcador de tipo generico, como un contrato que dice no se sabe qué datos va a devolver todavía esto, pero el que la llame decidirá el tipo
  public async query<T = unknown>(...[text, params]: QueryArgs): Promise<T[]> {
    const result = await this.pool.query(text, params);
    return result.rows as  T[];
  }
}