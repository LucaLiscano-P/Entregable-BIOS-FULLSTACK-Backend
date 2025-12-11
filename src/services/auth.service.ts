import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { config } from "../config/env";
import { TypeRegister, TypeLogin, TypeEditProfile } from "../schemas/auth.schemas";

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

export const registerService = async (data: TypeRegister) => {
  const { name, email, password } = data;

  // Validar formato del email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("El email no es válido");
  }

  const existUser = await User.findOne({ email });
  if (existUser) {
    throw new Error("Usuario ya existe");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    email,
    name,
    password: hashedPassword,
    rol: "user",
  });

  const token = jwt.sign(
    { id: newUser._id.toString(), role: newUser.rol },
    config.jwtSecret,
    { expiresIn: "24h" }
  );

  const userFinal = {
    id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    rol: newUser.rol,
  };

  return { user: userFinal, token };
};

export const loginService = async (data: TypeLogin) => {
  const { email, password } = data;

  // Validar formato del email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("El email no es válido");
  }

  // Verificar si existe el usuario
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Credenciales inválidas");
  }

  // Comparar contraseñas
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error("Credenciales inválidas");
  }

  // Generar token JWT
  const token = jwt.sign(
    {
      id: user._id.toString(),
      role: user.rol,
    },
    config.jwtSecret,
    { expiresIn: "24h" }
  );

  // Respuesta limpia
  const userResponse = {
    id: user._id,
    name: user.name,
    email: user.email,
    rol: user.rol,
  };

  return { user: userResponse, token };
};

export const editProfileService = async (
  userId: string,
  updateData: TypeEditProfile
) => {
  const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!updatedUser) {
    throw new Error("Usuario no encontrado");
  }

  return updatedUser;
};

export const getProfileService = async (userId: string) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  return user;
};