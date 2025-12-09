import { Router } from "express";
import { changePassword, editProfile, getProfile, login, register } from "../controllers/auth.controller";
import { editProfileSchema, loginSchema, registerSchema } from "../schemas/auth.schemas";
import { validate } from "../middlewares/validate.middleware";
import { requireAuth } from "../middlewares/auth.middlewares";

export const authRoutes = Router();

authRoutes.post("/register", validate(registerSchema), register);

authRoutes.post("/login", validate(loginSchema), login);

authRoutes.put("/edit-profile", requireAuth, validate(editProfileSchema), editProfile);

authRoutes.get("/profile", requireAuth, getProfile);

authRoutes.put("/edit-password", requireAuth, changePassword);
