import bcrypt from "bcryptjs";
import { User } from "../models/user.model";

export const changePasswordService = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  // Comparar contraseña actual
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw new Error("La contraseña actual es incorrecta");
  }

  // Evitar usar la misma contraseña
  const isSamePassword = await bcrypt.compare(newPassword, user.password);
  if (isSamePassword) {
    throw new Error("La nueva contraseña no puede ser igual a la anterior");
  }

  // Hashear nueva contraseña
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;
  await user.save();

  return true;
};