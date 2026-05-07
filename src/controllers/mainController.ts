import type { NextFunction, Request, Response } from "express";

export async function getHome(req: Request, res: Response) {
    res.render('index')
}

export async function catchAll(err: any, req: Request, res: Response, next: NextFunction) {
    console.error(err);
    res.send("Algo salió mal =(");
}