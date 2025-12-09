import z from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "El email no es válido" }  ),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const registerSchema = z.object({
  name: z.string().min(5, "El nombre debe tener al menos 5 caracteres"),
  email: z.string().email({ message: "El email no es válido" }),
  password: z.string().min(6 , "La contraseña debe tener al menos 6 caracteres"),
  rol : z.enum(["admin", "user", "superadmin"]).optional(),
});

export const editProfileSchema = z.object({
  name: z.string().min(5, "El nombre debe tener al menos 5 caracteres").optional(),
  email: z.string().email({ message: "El email no es válido" }).optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6, "La contraseña actual es obligatoria"),
  newPassword: z.string().min(6, "La nueva contraseña debe tener al menos 6 caracteres"),
});

export type TypeChangePassword = z.infer<typeof changePasswordSchema>;
export type TypeLogin = z.infer<typeof loginSchema>;
export type TypeRegister = z.infer<typeof registerSchema>;
export type TypeEditProfile = z.infer<typeof editProfileSchema>;