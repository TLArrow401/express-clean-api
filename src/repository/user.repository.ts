// Intermedario entre la bd y el servicio.
import Database from "../config/database.js";
import { AppError } from "../middlewares/ErrorHandler.js";
import * as UserModel from "../models/user.model.js";


export default class UserRepository {
  // variable de instancia de la db
  private db: Database;
  // Constructor inicializador de la instacia de conexion a la base de datos
  constructor() {
    this.db = Database.getInstance();
  }
  // Metodo para obtencion de registros 
  async getAll(): Promise<UserModel.UserResponseDTO[]> {
    try {
      const rows = await this.db.query<UserModel.UserRow>("SELECT id, username, email, status, last_login_at, created_at  FROM security.users WHERE delete_at IS NULL");
      // Conversion de datos db a code a response
      return rows.map(this.mapToResponse);
    } catch (error) {
      throw new AppError("Database error fetching users", 500)
    }
  }
  // Metodo de obtencion por id
  async getById(id: number): Promise<UserModel.UserResponseDTO | null> {
    try {
      const [user] = await this.db.query<UserModel.UserRow>("SELECT id, username, email, status, last_login_at, created_at FROM security.users WHERE id = $1 AND delete_at IS NULL", [id]);

      return user ? this.mapToResponse(user) : null;
    } catch (error) {
      throw new AppError("Database error fetching user by id", 500);
    }
  }
  // Metodo de creacion
  async create(data: UserModel.CreateUserDTO): Promise<UserModel.UserResponseDTO> {
    try {
      const rows = await this.db.query<UserModel.UserRow>(`INSERT INTO security.users (username, email, password, status, created_at) VALUES ($1, $2, $3, 'active', NOW()) RETURNING id, username, email, status, last_login_at, created_at`, [data.username, data.email, data.password]);
      const [user] = rows;
      if (!user) throw new AppError("Failed to create user", 500);
      return this.mapToResponse(user);
    } catch (error) {
      console.error(error);
      throw new AppError("Database error creating user", 500);
    }
  }
  // Metodo de actualizacion
  async update(id: number, data: UserModel.UpdateUserDTO): Promise<UserModel.UserResponseDTO | null> {
    try {
      // definicion de lista blanca
      const allowedFields: (keyof UserModel.UpdateUserDTO)[] = [
        "username",
        "password",
        "email",
        "status"
      ];
      // Paso de filtrado de campos no permitidos
      const entries = Object.entries(data).filter(([key, value]) => allowedFields.includes(key as keyof UserModel.UpdateUserDTO) && value !== undefined);
      // Validacion de existencia de campos a actualizar
      if (entries.length === 0) return null;
      //construccion dinamica segura
      const fields = entries.map(([column], index) => `${column}= $${index + 1}`);
      const values = entries.map(([_, value]) => value);
      values.push(id.toString()); // Agregar el id al final de los valores para la consulta
      //Ejecucion de la consulta query
      const rows = await this.db.query<UserModel.UserRow>(`UPDATE security.users SET ${fields.join(", ")} WHERE id = $${values.length} AND delete_at IS NULL RETURNING id, username, email, status, last_login_at, created_at`, values);
      // Desestructuracion para obtener primer registro existente
      const [user] = rows;
      // Evlua existe un registro actualizado si, si devuelve el dato y si no devuelve null
      return user ? this.mapToResponse(user) : null;
    } catch (error) {
      throw new AppError("Database error updating user", 500);
    }
  }
  // Metodo de borrado logico
  async delete(id: number): Promise<boolean>{
    try {
      const rows = await this.db.query(`UPDATE security.users SET delete_at = NOW() WHERE id = $1 AND delete_at IS NULL RETURNING id`, [id]);
      return rows.length > 0;
    } catch (error) {
       throw new AppError("Database error deleting user", 500);
    }
  }
  /**
   * Conversor de datos directo DB → Response
   * @param row 
   * @returns Mapeo de datos de formato DB a formato dev para response tipado
   */
  private mapToResponse(row: UserModel.UserRow): UserModel.UserResponseDTO {
    return {
      id: row.id,
      username: row.username,
      email: row.email,
      status: row.status,
      lastLoginAt: row.last_login_at,
      createdAt: row.created_at
    };
  }
}