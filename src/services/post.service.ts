import mongoose from "mongoose";
import { Category } from "../models/category.model";
import { Post } from "../models/post.model";
import { TypePost, TypeUpdatePost } from "../schemas/post.schemas";

export const updateData = async (postId: string, postData: TypeUpdatePost) => {
  try {
    // Validar que el ID del post sea correcto
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return {
        success: false,
        message: "ID de post inválido",
        data: null,
      };
    }

    // Si se actualiza el título, verificar que no exista en otro post
    if (postData.title) {
      const titleExists = await Post.findOne({
        title: postData.title,
        _id: { $ne: postId }, // excluye el post actual
      });

      if (titleExists) {
        return {
          success: false,
          message: "El título ya está en uso por otro post",
          data: null,
        };
      }
    }

    // Si se actualiza category, validar ObjectId y existencia real
    if (postData.category) {
      if (!mongoose.Types.ObjectId.isValid(postData.category)) {
        return {
          success: false,
          message: "Categoría inválida",
          data: null,
        };
      }

      const categoryExists = await Category.findById(postData.category);

      if (!categoryExists) {
        return {
          success: false,
          message: "La categoría no existe",
          data: null,
        };
      }
    }
  } catch (error: any) {
    return {
      success: false,
      message: "Error al actualizar el post: " + error.message,
      data: null,
    };
  }

  const updatedPost = await Post.findByIdAndUpdate(postId, postData, {
    new: true, // Devuelve el documento actualizado
    runValidators: true, // Ejecuta las validaciones definidas en el esquema
  });

  if (!updatedPost) {
    return {
      success: false,
      message: "Post no encontrado",
      data: null,
    };
  }

  return {
    success: true,
    message: "Post actualizado correctamente",
    data: updatedPost,
  }
};

export const findDataById = async (id: string) => {
  return await Post.findOne({ _id: id });
};

export const getAllData = async (
  page: number,
  limit: number,
  category?: string
) => {
  const query = category ? { category } : {};

  const posts = await Post.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Post.countDocuments(query);

  return { posts, total };
};

export const createData = async (postData: TypePost, userId: string) => {
  try {
    // Validar título único manualmente
    const exists = await Post.findOne({ title: postData.title });

    if (exists) {
      throw new Error("El título ya está en uso");
    }

    // Validar categoría
    const categoryId = postData.category;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      throw new Error("Categoría no encontrada o inválida");
    }

    const categoryExists = await Category.findById(categoryId);

    if (!categoryExists) {
      throw new Error("Categoría no encontrada o inválida");
    }

    // Crear el post
    const newPost = new Post({
      ...postData,
      user: userId,
    });

    await newPost.save();

    return newPost;

  } catch (error: any) {
    throw new Error("Error al crear el post: " + error.message);
  }
};

export const deleteData = async (postId: string) => {
  const deletedPost = await Post.findOneAndDelete({ _id: postId });

  if (!deletedPost) {
    return {
      success: false,
      message: "No se encontró el post para eliminar",
      deletedPost: null,
    };
  }

  return {
    success: true,
    message: "Post eliminado correctamente",
    deletedPost,
  };
};
