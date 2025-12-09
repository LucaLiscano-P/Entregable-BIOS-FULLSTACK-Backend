import z from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
});

export const updateCategorySchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").optional(),
});

export type TypeCreateCategory = z.infer<typeof createCategorySchema>;
export type TypeUpdateCategory = z.infer<typeof updateCategorySchema>;
