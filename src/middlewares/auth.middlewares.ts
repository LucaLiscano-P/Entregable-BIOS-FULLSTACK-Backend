import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/env";


export interface RequestWithUser extends Request {
  userId?: string;
  // cambiar a role para mayor claridad y permitir más roles
  role?: "user" | "admin" | "superadmin";
}

export const requireAuth = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "token no proporcionado" });
    }

    const decoded = jwt.verify(token, config.jwtSecret) as {
      id: string;
      role: "user" | "admin" | "superadmin";
    };

    req.userId = decoded.id;
    req.role = decoded.role;

    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalido o expirado" });
  }
};


export const requireRole = (...roles: Array<"user" | "admin" | "superadmin">) => {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (!req.role) {
      return res.status(401).json({ message: "No autenticado" });
    }

    if (!roles.includes(req.role)) {
      return res.status(403).json({
        message: "No tienes permisos para realizar esta acción"
      });
    }

    next();
  };
};