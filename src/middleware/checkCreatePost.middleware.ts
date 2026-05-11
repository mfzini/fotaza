import type { NextFunction, Request, Response } from 'express';
import { normalizeStr } from '../utils/strUtils.js';
export async function checkCreatePost(req: Request, res: Response, next: NextFunction) {
    req.body.title = normalizeStr(req.body.title);
    req.body.desc = normalizeStr(req.body.desc);
    req.body.tags = req.body.tags.split(/[,;]/).map((tag: string) => normalizeStr(tag)).filter(Boolean);
    
    const { title, desc, tags } = req.body;
    const files = req.files as Express.Multer.File[];
    const err: string[] = [];

    if (files.filter(f => !/(image|video)/.test(f.mimetype)).length > 0) 
        err.push('Solo se admiten imágenes y videos.')

    if (!title) err.push('El título es obligatorio.');

    if (desc.length > 250) err.push('La descripción admite un máximo de 250 caracteres.');
    
    if (tags.length == 0) err.push('Se requiere como mínimo una etiqueta.');

    if (req.files?.length == 0) err.push('La publicación requiere mínimo un archivo.');
    
    if (err.length > 0)
        return res.render('createPost', { err, title, desc, tags: tags.toString() });
    next();
}