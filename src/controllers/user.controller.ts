import { type Request, type Response, type NextFunction} from "express";
import UserService from "../services/user.services.js";
import type { CreateUserDTO, UpdateUserDTO } from "../models/user.model.js";

export default class UserController{
  constructor(private userService: UserService) { }
  
  // Metodo de obtencion de todos los usuarios
  listUsers = async (req: Request, res: Response, next: NextFunction)=>{
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json({
        message: "Users fetched successfully",
        data: users
      });
    } catch (error:unknown) {
      next(error);
    }
  }

  // Metodo de obtencion de usuario por id
  getUserById = async (req: Request, res: Response, next: NextFunction)=>{
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid user ID" });

      const user = await this.userService.getByIdUser(id);
      res.status(200).json({
        message: "User fetched successfully",
        data: user
      })
    } catch (error: unknown) {
      next(error);
    }
  }

  // Metodo de creacion de usuario
  createUser = async (req: Request, res: Response, next: NextFunction)=>{
    try {
      const userData: CreateUserDTO = req.body;
      const newUser = await this.userService.createUser(userData);
      res.status(201).json({
        message: "User created successfully",
        data: newUser
      });
    } catch (error: unknown) {
      next(error);
    }
  }
  // Metodo de actualizacion de usuario
  updateUser = async (req: Request, res: Response, next: NextFunction)=>{
    try {
      const id = Number(req.params.id);
      const userData: UpdateUserDTO = req.body;
      if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid user ID" });
      const updatedUser = await this.userService.updateUser(id, userData);
      res.status(200).json({
        message: "User updated successfully",
        data: updatedUser
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  // Metodo de eliminacion de usuario
  deleteUser = async (req: Request, res: Response, next: NextFunction)=>{
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid user ID" });
      await this.userService.deleteUser(id);
      res.status(200).json({
        message: "User deleted successfully"
      });
    } catch (error: unknown) {
      next(error);
    }
  }
}