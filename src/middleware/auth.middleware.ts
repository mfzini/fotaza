import type { NextFunction, Request, Response } from "express";

export const isAuthenticated = (req: Request, res:  Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}