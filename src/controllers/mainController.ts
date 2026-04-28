import type { Request, Response } from "express";

export async function getHome(req: Request, res: Response) {
    res.render('index');
}