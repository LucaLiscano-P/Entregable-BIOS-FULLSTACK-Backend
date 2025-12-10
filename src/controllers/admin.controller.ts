import { Request, Response } from "express";
import { createUserService, deleteUserService, getAllUsersService } from "../services/admin.service";



export const adminCreateUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, rol } = req.body;
    const {roleAdmin} = req.body; 
    const user = await createUserService(name, email, password, rol, roleAdmin);
  
    res.status(201).json({ message: "Usuario creado exitosamente", user: user});
  } catch (error: unknown ) {
    return res.status(500).json({ message: "Error al crear usuario", error: (error as Error).message });
  }
};


export const adminDeleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const {role} = req.body; 

    if (!id) {
    return res.status(400).json({ message: "El ID es obligatorio" });
    }

    try {
    const deletedUser = await deleteUserService(id, role);
        res.status(200).json({ message: "Usuario eliminado exitosamente", user: deletedUser });
    } catch (error: unknown ) {
    return res.status(500).json({ message: "Error al eliminar usuario", error: (error as Error).message });
  }

}


export const getAllUsers = async (req: Request, res: Response) => {
  try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const category = req.query.category as string | undefined;
  
      const { posts, total } = await getAllUsersService(page, limit, category);
  
      return res.status(200).json({
        message: "Productos obtenidos exitosamente",
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
