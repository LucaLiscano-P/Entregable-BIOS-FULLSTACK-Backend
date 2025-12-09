import mongoose, { Schema, Document } from "mongoose";

export interface CategoryInterface extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<CategoryInterface>(
  {
    name: { type: String, required: true, unique: true },
  },
  {
    timestamps: true, // crea createdAt y updatedAt automático
  }
);

export const Category = mongoose.model<CategoryInterface>(
  "Category",
  CategorySchema
);
