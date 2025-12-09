import mongoose from "mongoose";
import { User } from "../models/user.model";
import bycript from "bcryptjs";


export const createUserService= async (name: string, email: string, password: string, rol: string) => {
    const existUser = await User.findOne({ email });
        if (existUser) {
          throw new Error("Usuario ya existente");
        }
    
      const hashedPasword = await bycript.hash(password, 10);
      const newUser = await User.create({
        email,
        name,
        password: hashedPasword,
        rol: rol,
      })

      const userFinal = {
      name: newUser.name,
      email: newUser.email,
      rol: newUser.rol
    }
    return userFinal;
};

export const deleteUserService = async (id: string) => {
  // 1. Validar que el ID sea un ObjectId válido
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("ID inválido");
  }

  // 2. Buscar y eliminar el usuario
  const deletedUser = await User.findByIdAndDelete(id);

  // 3. Si no existe, informarlo
  if (!deletedUser) {
    throw new Error("Usuario no encontrado");
  }

  // 4. Todo ok
  return deletedUser;
};


export const getAllUsersService = async (
  page: number,
  limit: number,
  category?: string
) => {
  const query = category ? { category } : {};

  const posts = await User.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await User.countDocuments(query);

  return { posts, total };
};