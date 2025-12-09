import mongoose, { Document, Schema } from "mongoose";

export interface UserInterface extends Document {
    name: string;   // User's name
    email: string;  // User's email
    password: string; // User's hashed password
    rol: "admin" | "user" | "superadmin"; // User role (e.g., user, admin)
}

const userSchema = new Schema<UserInterface>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    rol: { type: String, enum: ["admin", "user", "superadmin"], default: "user" } // User role
})

export const User = mongoose.model<UserInterface>('User', userSchema);