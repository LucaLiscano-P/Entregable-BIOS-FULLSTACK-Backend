import { Request, Response, NextFunction} from "express";
import { z } from "zod";


export const validate = (schema: z.ZodObject<any>) => {

    return async (req: Request, res: Response, next: NextFunction) =>{
        try {
            await schema.parseAsync(req.body); // Valida el cuerpo de la solicitud según el esquema proporcionado
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: error.issues.map((e) => ({
                        path: e.path,
                        message: e.message,
                    })),
                });
            }
            next(error);
        }
    }
};