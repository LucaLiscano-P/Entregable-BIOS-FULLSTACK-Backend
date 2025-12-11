import { Router } from "express";
import { createCategory, deleteCategory, getCategories, getCategoryById, updateCategory } from "../controllers/category.controller";
import { requireAuth, requireRole } from "../middlewares/auth.middlewares";
import { validate } from "../middlewares/validate.middleware";
import { createCategorySchema } from "../schemas/category.schema";

export const categoryRoute = Router();

categoryRoute.post("/", requireAuth, requireRole("admin", "superadmin"), validate(createCategorySchema), createCategory); 

categoryRoute.get("/", getCategories);

categoryRoute.get("/:id", getCategoryById);

categoryRoute.put("/:id", requireAuth, requireRole("admin", "superadmin"), validate(createCategorySchema), updateCategory);

categoryRoute.delete("/:id", requireAuth, requireRole("admin", "superadmin"), deleteCategory);
