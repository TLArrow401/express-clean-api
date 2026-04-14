// Representacion de los datos o entidad bd.
import { z } from "zod";
/**
 * Interfaz interna para representar el formato de llegada de los datos de la BD
 */
/* Exporte de tipos en tiempo de ejecucion con zod */
export const UserRowSchema = z.object({
  id: z.number(),
  username: z.string(),
  password: z.string().min(6).max(35),
  email: z.string().trim().toLowerCase().email().min(6).max(30),
  status: z.enum(["active", "inactive", "blocked"]),
  last_login_at: z.coerce.date().nullable(),
  created_at: z.coerce.date(),
  delete_at: z.coerce.date().nullable(),
});

// Definicion de tipos de datos del code
export const UserCreateSchema = z.object({
  username: z.string().min(4).max(16),
  password: z.string().min(6).max(35),
  email: z.string().trim().toLowerCase().email().min(6).max(30),
});

export const UserUpdateSchema = UserCreateSchema.extend({
  status: z.enum(["active", "inactive", "blocked"]).optional(),
}).partial();

// Tipo de como se envian los datos
export const UserResponseSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().trim().toLowerCase().email().min(6).max(30),
  status: z.enum(["active", "inactive", "blocked"]),
  lastLoginAt: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
});

// Tipo para validacion de parametros de ruta
export const IdParams = z.object({
  id: z.coerce.number().int().positive(),
})

/**
 * Exportaciones finales de tipos
 */
/* Exporte de tipos en tiempo de compilacion */
export type UserRow = z.infer<typeof UserRowSchema>;
export type CreateUserDTO = z.infer<typeof UserCreateSchema>;
export type UpdateUserDTO = z.infer<typeof UserUpdateSchema>;
export type UserResponseDTO = z.infer<typeof UserResponseSchema>;

//////////////////////////////
//    Codigo anterior      //
////////////////////////////
/* export interface UserRow {
  id: number;
  username: string;
  password: string;
  email: string;
  status: string;
  last_login_at: Date;
  created_at: Date;
  delete_at: Date;
} */

/* export interface CreateUserDTO {
  username: string;
  password: string;
  email: string;
} */

/* export interface UpdateUserDTO {
  username?: string;
  password?: string;
  email?: string;
  status?: string;
} */

/*   export interface UserResponseDTO {
  id: number;
  username: string;
  email: string;
  status: string;
  lastLoginAt: Date | null;
  createdAt: Date;
} */
