import { Router } from "express";
import { requireAuth, requireRole } from "../middlewares/auth.middlewares";
import { adminCreateUser, adminDeleteUser, getAllUsers } from "../controllers/admin.controller";

export const adminRouter = Router();

// Crear usuario (solo admin o superadmin)
adminRouter.post("/create-user", requireAuth,requireRole("admin", "superadmin"), adminCreateUser);

// Eliminar usuario (solo superadmin o admin)
adminRouter.delete("/delete-user/:id", requireAuth, requireRole("admin", "superadmin"), adminDeleteUser);

// Ver todos los usuarios (solo admin o superadmin)
adminRouter.get("/users", requireAuth, requireRole("admin", "superadmin"), getAllUsers);