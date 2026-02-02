import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.auth_token;

    if (!token) return res.status(401).json({ error: "Du er ikke logget ind" });

    try {
        const verifiedToken = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as { userId: number };


        req.userId = verifiedToken.userId;
        next();
    } catch (err) {
        return res.status(403).json({ error: "Ugyldig eller udløbet token" });
    }
}