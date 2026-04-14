import express, { Router } from "express";
import UserRepository from "../repository/user.repository.js";
import UserService from "../services/user.services.js";
import UserController from "../controllers/user.controller.js";

import validationRequest from "../middlewares/validation-request.middleware.js";
import {
  IdParams,
  UserCreateSchema,
  UserUpdateSchema,
} from "../models/user.model.js";

const router: Router = express.Router();
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
router.get(
  "/:id",
  validationRequest(IdParams, "params"),
  userController.getUserById,
);
router.post(
  "/",
  validationRequest(UserCreateSchema),
  userController.createUser,
);
router.put(
  "/:id",
  validationRequest(IdParams, "params"),
  validationRequest(UserUpdateSchema, "body"),
  userController.updateUser,
);
router.patch(
  "/:id",
  validationRequest(IdParams, "params"),
  userController.deleteUser,
);

export default router;
