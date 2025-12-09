import { Router } from "express";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../controllers/category.controller";
import { requireAuth, requireRole } from "../middlewares/auth.middlewares";

export const categoryRoute = Router();

categoryRoute.post("/", requireAuth, requireRole("admin", "superadmin"), createCategory); 

categoryRoute.get("/", getCategories);

categoryRoute.put("/:id", requireAuth, requireRole("admin", "superadmin"), updateCategory);

categoryRoute.delete("/:id", requireAuth, requireRole("admin", "superadmin"), deleteCategory);
