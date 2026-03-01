import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const isProduction = process.env.NODE_ENV === 'production';
const JWT_SECRET = isProduction 
  ? (process.env.JWT_SECRET || (() => { throw new Error('JWT_SECRET required in production'); })())
  : (process.env.JWT_SECRET || 'dev_fallback_secret_2026');

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Access denied' });

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        (req as any).user = user;
        next();
    });
}
