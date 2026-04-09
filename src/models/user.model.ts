// Representacion de los datos o entidad bd.
/**
 * Interfaz interna para representar el formato de llegada de los datos de la BD
 */
export interface UserRow {
  id: number;
  username: string;
  password: string;
  email: string;
  status: string;
  last_login_at: Date;
  created_at: Date;
  delete_at: Date;
}

// Definicion de tipos de datos del code
export interface CreateUserDTO {
  username: string;
  password: string;
  email: string;
}

export interface UpdateUserDTO {
  username?: string;
  password?: string;
  email?: string;
  status?: string;
}

// Tipo de como se envian los datos
export interface UserResponseDTO {
  id: number;
  username: string;
  email: string;
  status: string;
  lastLoginAt: Date | null;
  createdAt: Date;
}