import type { NextFunction, Request, Response } from 'express';


const MAGIC_NUMBERS = {
    jpg: 'ffd8ff',
    png: '89504e47',
    gif: '47494638',
    webp: '52494646',
    mp4: '66747970'
};

const magicCheck = (b: Buffer) => {
    const bufferHeader = b.subarray(0, 8);
    const hex = bufferHeader.toHex();
    let esValido = false;
    if (hex.startsWith(MAGIC_NUMBERS.jpg) ||
        hex.startsWith(MAGIC_NUMBERS.png) ||
        hex.startsWith(MAGIC_NUMBERS.gif) ||
        hex.includes(MAGIC_NUMBERS.mp4) ||
        hex.startsWith(MAGIC_NUMBERS.webp)) {
        esValido = true;
    }
    return esValido
}

export async function checkCreatePost(req: Request, res: Response, next: NextFunction) {
    const { title, desc, tags } = req.body;
    const files = req.files as Express.Multer.File[];
    const err: string[] = [];

    if (files.filter(f => {
        return !magicCheck(f.buffer) && !/(image|video)/.test(f.mimetype);
    }).length > 0)
        err.push('Solo se admiten imágenes y videos.')

    if (!title) err.push('El título es obligatorio.');

    if (desc.length > 250) err.push('La descripción admite un máximo de 250 caracteres.');

    if (tags.length == 0) err.push('Se requiere como mínimo una etiqueta.');

    if (req.files?.length == 0) err.push('La publicación requiere mínimo un archivo.');

    if (err.length > 0)
        return res.render('createPost', { err, title, desc, tags: tags.toString() });
    next();
}