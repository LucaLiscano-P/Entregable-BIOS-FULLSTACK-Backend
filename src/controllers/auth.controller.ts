import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import {
  TypeRegister,
  TypeLogin,
  TypeEditProfile,
} from "../schemas/auth.schemas";
import bycript from "bcryptjs";
import { config } from "../config/env";
import { User } from "../models/user.model";
import { RequestWithUser } from "../middlewares/auth.middlewares";
import { changePasswordService } from "../services/auth.service";

interface EditProfileRequest extends RequestWithUser {
  body: TypeEditProfile;
}

interface TypeChangePassword extends RequestWithUser {
  body: {
    currentPassword: string;
    newPassword: string;
  };
}

export const register = async (
  req: Request<{}, {}, TypeRegister>,
  res: Response
) => {
  try {
    const { name, email, password } = req.body;

    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "Usuario ya existente" });
    }

    const hashedPasword = await bycript.hash(password, 10);
    const newUser = await User.create({
      email,
      name,
      password: hashedPasword,
      rol: "user",
    });

    const token = jwt.sign(
      { id: newUser._id.toString(), role: newUser.rol },
      config.jwtSecret,
      { expiresIn: "24h" }
    );

    const userFinal = {
      name: newUser.name,
      email: newUser.email,
      rol: newUser.rol,
    };
    return res
      .status(201)
      .json({ message: "usuario creado exitosamente", user: userFinal, token });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Error al registrar usuario" });
  }
};

export const login = async (req: Request<{}, {}, TypeLogin>, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Credenciales invalidas" });
    }

    const isValidPassword = await bycript.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Credenciales invalidas" });
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        role: user.rol, // <-- AHORA SÍ
      },
      config.jwtSecret,
      { expiresIn: "24h" }
    );

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      rol: user.rol,
    };

    return res
      .status(200)
      .json({ message: "Login exitoso", user: userResponse, token });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Error al iniciar sesión" });
  }
};

export const editProfile = async (req: EditProfileRequest, res: Response) => {
  try {
    const userId = req.userId; // viene del token
    const updateData = req.body;

    if (!userId) {
      return res.status(401).json({ message: "No autenticado" });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.status(200).json({
      message: "Perfil actualizado correctamente",
      user: updatedUser,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al actualizar el perfil",
      error: error.message,
    });
  }
};

export const getProfile = async (req: RequestWithUser, res: Response) => {
  try {
    const userId = req.userId;
    // Buscar el usuario sin incluir la contraseña
    const user = await User.findById(userId).select("-password");
    console.log(user);

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    return res.status(200).json({
      message: "Perfil obtenido correctamente",
      user,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al obtener el perfil",
      error: error.message,
    });
  }
};

export const changePassword = async (
  req: TypeChangePassword,
  res: Response
) => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "No autenticado" });
    }

    await changePasswordService(userId, currentPassword, newPassword);

    return res.status(200).json({
      message: "Contraseña actualizada correctamente",
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || "Error al cambiar la contraseña",
    });
  }
};
