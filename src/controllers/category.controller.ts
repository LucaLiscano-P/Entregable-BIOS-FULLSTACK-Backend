// controllers/category.controller.ts
import { Request, Response } from "express";
import { createCategoryService, deleteCategoryService, getCategoriesService, updateCategoryService } from "../services/category.service";

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "El nombre es obligatorio" });
    }

    const category = await createCategoryService(name);
    return res.status(201).json({
      message: "Categoría creada",
      data: category
    });
  } catch (error: unknown) {
     return res.status(400).json({
      message: "Error al crear la categoría",
      error: (error as Error).message,
    });
  }
};


export const getCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await getCategoriesService();
    return res.status(200).json({
      message: "Categorías obtenidas",
      data: categories
    });
  } catch (error: unknown) {
    return res.status(500).json({ message: "SERVER ERROR", error: (error as Error).message });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;

    if (!id) {
    return res.status(400).json({ message: "El ID es obligatorio" });
    }

  try {
    const category = await updateCategoryService(id, data);

    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    return res.status(200).json({
      message: "Categoría actualizada correctamente",
      data: category,
    });
  } catch (error: unknown) {
     return res.status(400).json({
      message: "Error al actualizar la categoría",
      error: (error as Error).message,
    });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "El ID es obligatorio" });
  }

  try {
    const category = await deleteCategoryService(id);

    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    return res.status(200).json({
      message: "Categoría eliminada correctamente",
    });
  } catch (error: unknown) {
    return res.status(500).json({
      message: "Error al eliminar la categoría",
      error: (error as Error).message,
    });
  }
};