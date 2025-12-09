import { Router } from "express";
import { createPost, deletePost, getAllPosts, updatePost, getPost} from "../controllers/post.controller";
import { requireAuth, requireRole } from "../middlewares/auth.middlewares";
import { validate } from "../middlewares/validate.middleware";
import { postSchema, updatePostSchema } from "../schemas/post.schemas";

export const postRoutes = Router();

postRoutes.get("/", getAllPosts);
postRoutes.post("/", requireAuth,requireRole("admin", "superadmin"), validate(postSchema), createPost);
postRoutes.get("/:id", getPost);
postRoutes.put("/:id", requireAuth,requireRole("admin", "superadmin"), validate(updatePostSchema), updatePost);
postRoutes.delete("/:id", requireAuth, requireRole("admin", "superadmin"), deletePost);