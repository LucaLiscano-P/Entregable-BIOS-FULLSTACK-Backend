import { Request, Response } from "express";
import { createUserService, deleteUserService, getAllUsersService } from "../services/admin.service";
import { RequestWithUser } from "../middlewares/auth.middlewares";

interface AdminCreateRequest extends RequestWithUser {
  body: {
    name: string;
    email: string;
    password: string;
    rol: string;
  };
}

export const adminCreateUser = async (
  req: AdminCreateRequest,
  res: Response
) => {
  try {
    const { name, email, password, rol } = req.body;
    const userRole = req.role; // rol del token

    if (!name || !email || !password || !rol) {
      return res
        .status(400)
        .json({ message: "Nombre, email, contraseña y rol son obligatorios" });
    }

    if (!userRole) {
      return res
        .status(403)
        .json({ message: "No tenés permisos para crear usuarios" });
    }

    const user = await createUserService(
      name,
      email,
      password,
      rol,
      userRole
    );

    res.status(201).json({
      message: "Usuario creado exitosamente",
      user: user,
    });
  } catch (error: unknown) {
    return res.status(403).json({
      message: "Error al crear usuario",
      error: (error as Error).message,
    });
  }
};

export const adminDeleteUser = async (
  req: AdminCreateRequest,
  res: Response
) => {
  const { id } = req.params;
  const userRole = req.role; // rol del token

    if (!userRole) {
      return res
        .status(403)
        .json({ message: "No tenés permisos para eliminar usuarios" });
    }

  if (!id) {
    return res.status(400).json({ message: "El ID es obligatorio" });
  }

  try {
    const deletedUser = await deleteUserService(id, userRole);
    res.status(200).json({
      message: "Usuario eliminado exitosamente",
      user: deletedUser,
    });
  } catch (error: unknown) {
    return res.status(403).json({
      message: "Error al eliminar usuario",
      error: (error as Error).message,
    });
  }
};

export const getAllUsers = async (req: RequestWithUser, res: Response) => {
  try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const category = req.query.category as string | undefined;
  
      const { posts, total } = await getAllUsersService(page, limit, category);
  
      return res.status(200).json({
        message: "Usuarios obtenidos exitosamente",
        data: {
          posts,
          pagination: {
            total,
            page,
            pages: Math.ceil(total / limit),
            limit,
          },
        },
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error al obtener las tareas",
        error: "SERVER ERROR",
      });
    }
};
