// services/category.service.ts
import { Category } from "../models/category.model";
import mongoose from "mongoose";

export const createCategoryService = async (name: string) => {
  const exists = await Category.findOne({ name });
  if (exists) {
    throw new Error(`El nombre de la categoría ${name} ya está en uso`);
  }

  const newCategory = await Category.create({ name });
  return newCategory;
};

export const getCategoriesService = async () => {
  return await Category.find();
};

export const getCategoryByIdService = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("ID inválido");
  }

  const category = await Category.findById(id);
  
  if (!category) {
    throw new Error("Categoría no encontrada");
  }

  return category;
};

export const updateCategoryService = async (id: string, data: any) => {

  const exist = await Category.findById(id);
  if (!exist) {
    throw new Error("Categoría no encontrada");
  }  

  const existsName = await Category.findOne({ name: data.name });
  
  if (existsName) {
    throw new Error(`El nombre de la categoría ${data.name} ya está en uso`);
  }
  const updatedCategory = await Category.findByIdAndUpdate(
    id,
    { ...data },
    { new: true } // retorna la categoria actualizada
  );

  return updatedCategory;
};

export const deleteCategoryService = async (id: string) => {
  const deletedCategory = await Category.findByIdAndDelete(id);
  return deletedCategory;
};
