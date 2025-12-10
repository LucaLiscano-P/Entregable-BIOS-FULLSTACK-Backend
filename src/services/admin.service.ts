import mongoose from "mongoose";
import { User } from "../models/user.model";
import bycript from "bcryptjs";


export const createUserService = async (
  name: string,
  email: string,
  password: string,
  rol: string,
  rolAdmin: string
) => {
  // 1. Validar campos básicos
  if (!name || !email || !password || !rol) {
    throw new Error("Todos los campos son obligatorios");
  }

  // 2. Validar formato de email (simple)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Formato de email inválido");
  }

  // 3. Verificar permisos: solo un superadmin puede crear otro admin o superadmin
  if (["admin", "superadmin"].includes(rol) && rolAdmin !== "superadmin") {
    throw new Error("No tenés permisos para crear usuarios con rol elevado");
  }

  // 4. Verificar si el email ya existe
  const existUser = await User.findOne({ email });
  if (existUser) {
    throw new Error("Usuario ya existente");
  }

  // 5. Hashear contraseña
  const hashedPassword = await bycript.hash(password, 10);

  // 6. Crear usuario
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    rol,
  });

  // 7. Retornar info básica
  return {
    name: newUser.name,
    email: newUser.email,
    rol: newUser.rol,
  };
};

export const deleteUserService = async (id: string, requesterRole: string) => {
  // 1. Validar formato del ID antes de consultar la BD
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("El formato del ID es inválido");
  }

  // 2. Verificar si el usuario existe
  const userToDelete = await User.findById(id);
  if (!userToDelete) {
    throw new Error("Usuario no encontrado");
  }

  // 3. Verificar permisos (el que elimina no puede borrar a iguales o superiores)
  if (userToDelete.rol === "superadmin" && requesterRole !== "superadmin") {
    throw new Error("No tienes permisos para eliminar a un superadmin");
  }

  // 4. Eliminar usuario
  const deletedUser = await User.findByIdAndDelete(id);

  if (!deletedUser) {
    throw new Error("No se pudo eliminar el usuario");
  }

  return deletedUser;
};


export const getAllUsersService = async (
  page: number, // base de la pagina
  limit: number, // limite de usuarios por pagina
  category?: string // categoria opcional para filtrar
) => {
  const query = category ? { category } : {};

  const posts = await User.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await User.countDocuments(query);

  return { posts, total };
};