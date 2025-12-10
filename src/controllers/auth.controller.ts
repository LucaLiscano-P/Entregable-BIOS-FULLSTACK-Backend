import { Request, Response } from "express";
import {
  TypeRegister,
  TypeLogin,
  TypeEditProfile,
} from "../schemas/auth.schemas";
import { RequestWithUser } from "../middlewares/auth.middlewares";
import {
  changePasswordService,
  registerService,
  loginService,
  editProfileService,
  getProfileService,
} from "../services/auth.service";

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
    const result = await registerService(req.body);
    return res.status(201).json({
      message: "usuario creado exitosamente",
      user: result.user,
      token: result.token,
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(400).json({ message: (error as Error).message });
  }
};

export const login = async (
  req: Request<{}, {}, TypeLogin>,
  res: Response
) => {
  try {
    const result = await loginService(req.body);
    return res.status(200).json({
      message: "Login exitoso",
      user: result.user,
      token: result.token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(400).json({ message: (error as Error).message });
  }
};

export const editProfile = async (
  req: EditProfileRequest,
  res: Response
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "No autenticado" });
    }

    const updatedUser = await editProfileService(userId, req.body);

    return res.status(200).json({
      message: "Perfil actualizado correctamente",
      user: updatedUser,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || "Error al actualizar el perfil",
    });
  }
};

export const getProfile = async (req: RequestWithUser, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "No autenticado" });
    }

    const user = await getProfileService(userId);

    return res.status(200).json({
      message: "Perfil obtenido correctamente",
      user,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: error.message || "Error al obtener el perfil",
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
