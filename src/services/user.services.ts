// Logica de negocio, Reglas, validaciones, y procesos.
import argon2 from "argon2";
import UserRepository from "../repository/user.repository.js";
import { AppError } from "../middlewares/error-handler.middleware.js";
import { logger } from "../config/logger.js";
import type { UpdateUserDTO, CreateUserDTO } from "../models/user.model.js";

export default class UserService {
  constructor(private userRepo: UserRepository) {}

  // Metodo de obtencion de todos los usuarios
  async getAllUsers() {
    const users = await this.userRepo.getAll();
    if (users.length === 0) {
      throw new AppError("users not found", 404);
    }
    return users;
  }

  // Metodo de obtencion de usuario por id
  async getByIdUser(id: number) {
    const user = await this.userRepo.getById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  }

  // Metodo de creacion de usuario
  // falta validacion de password, hasheo, y validacion de estandar otros datos
  async createUser(data: CreateUserDTO) {
    const hashPass = await argon2.hash(data.password);
    const userToSave = { ...data, password: hashPass };
    // Validacion de usuario unico
    const user = await this.userRepo.getAll();
    const isDuplicate = user.some((u) => u.username === data.username);
    if (isDuplicate) {
      throw new AppError("Username already exists", 409);
    }
    // Creacion del usuario
    const newUser = await this.userRepo.create(userToSave);
    // Se retorna datos del nuevo usuario creado
    return newUser;
  }

  // Metodo de actualizacion de usuario
  async updateUser(id: number, data: UpdateUserDTO) {
    // Se realizar una validacion exista el usuario a actualizar
    const existingUser = await this.userRepo.getById(id);
    if (!existingUser) {
      throw new AppError("User not found", 404);
    }
    // Ejecutar la actualizacion del usuario
    const update = await this.userRepo.update(id, data);
    return update;
  }

  // Metodo de borrado de usuario
  async deleteUser(id: number) {
    // Se realizar una validacion exista el usuario a actualizar
    const existingUser = await this.userRepo.getById(id);
    if (!existingUser) {
      throw new AppError("User not found", 404);
    }
    // Ejecuta el borrado logico del usuario
    const data = await this.userRepo.delete(id);
    if (!data) {
      throw new AppError("Error deleting user", 404);
    }
    return data;
  }
}
