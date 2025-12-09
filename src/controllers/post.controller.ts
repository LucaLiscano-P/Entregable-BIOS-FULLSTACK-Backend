import { Request, Response } from "express";
// importar el tipo correcto
import { RequestWithUser } from "../middlewares/auth.middlewares";
import {
  createData,
  deleteData,
  findDataById,
  getAllData,
  updateData,
} from "../services/post.service";

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const category = req.query.category as string | undefined;

    const { posts, total } = await getAllData(page, limit, category);

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

export const getPost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "ID de post no proporcionado" });
    }

    const post = await findDataById(id);

    if (!post) {
      return res.status(404).json({ message: "Post no encontrado" });
    }

    return res.status(200).json({ message: "Post encontrado", data: post });
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener el post",
      error: "SERVER ERROR",
    });
  }
};

export const createPost = async (req: RequestWithUser, res: Response) => {
  try {
    const postData = req.body;
    const userId = req.userId || postData?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const newPost = await createData(postData, userId);

    return res.status(201).json({
      message: "Post creado correctamente",
      data: newPost,
    });

  } catch (error: any) {
    return res.status(400).json({
      message: error.message, // <- MOSTRAMOS EL ERROR REAL
    });
  }
};

export const updatePost = async (req: RequestWithUser, res: Response) => {
  try {
    const { id } = req.params;
    const postData = req.body;

    if (!id) {
      return res.status(400).json({ message: "ID de post no proporcionado" });
    }

    const result = await updateData(id, postData);

    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post editado correctamente",
      data: result.data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar el post",
      error: error,
    });
  }
};

export const deletePost = async (req: RequestWithUser, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "ID de post no proporcionado" });
    }

    const result = await deleteData(id);

    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: result.message,
      data: result.deletedPost,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error interno del servidor",
      error: "SERVER ERROR",
    });
  }
};
