import mongoose, { Document, Schema } from "mongoose";

export interface PostInterface extends Document {
  title: string;
  description: string;
  image: string;
  price: number;
  category: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<PostInterface>(
  {
    title: { type: String, unique: true, required: true },
    description: String,
    image: String,
    price: Number,
    category: { type: Schema.Types.ObjectId, ref: "Category" },
  },
  { timestamps: true }
);

export const Post = mongoose.model<PostInterface>("Post", PostSchema);
