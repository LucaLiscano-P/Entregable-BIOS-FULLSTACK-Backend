import z from "zod";

export const postSchema = z.object({
  title: z.string().min(5, "El título es obligatorio y debe tener al menos 5 caracteres"),
  description: z.string().optional(),
  price: z.number().positive("El precio debe ser un número positivo"),
  image: z.string().url("La imagen debe ser una URL válida"),
  category: z.string().min(1, "La categoría es obligatoria"),
});

export const updatePostSchema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres").optional(),
  description: z.string().optional(),
  price: z.number().positive("El precio debe ser un número positivo").optional(),
  category: z.string().min(1, "La categoría debe tener al menos 1 caracter").optional(),
  image: z.string().url("La imagen debe ser una URL válida").optional(),
});

export type TypePost = z.infer<typeof postSchema>;
export type TypeUpdatePost = z.infer<typeof updatePostSchema>;