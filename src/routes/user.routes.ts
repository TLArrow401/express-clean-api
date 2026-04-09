import express, { Router } from "express";
import UserRepository from "../repository/user.repository.js";
import UserService from "../services/user.services.js";
import UserController from "../controllers/user.controller.js";

const router: Router  = express.Router();
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

/**
 * Rutas para la gestion de usuarios
 * 1. Rutas Estáticas Específicas (Sin parámetros) 
 * 2. Rutas Dinámicas (Con parámetros :id)
 * 3. Rutas Dinámicas con sub-recursos (Ej: /users/:id/posts)
 */

// Rutas
router.get("/", userController.listUsers);
router.get("/:id", userController.getUserById);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.patch("/:id", userController.deleteUser);

export default router;