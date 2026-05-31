import type { NextFunction, Request, Response } from "express";

function normalize(str: string): string {
    return str.replace(/\s+/g, ' ').trim();
}

const clean = (str: string) => {
    return normalize(str.trim()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;'));
}


export async function sCleaner(req: Request, res: Response, next: NextFunction) {
    if (req.body.text) {
        if (typeof req.body.text !== 'string')
            return next(new Error('equis de'));
        req.body.text = clean(req.body.text);
    }
    if (req.body.title) {
        if (typeof req.body.title !== 'string')
            return next(new Error('equis de'));
        req.body.title = clean(req.body.title);
    }
    if (req.body.desc) {
        if (typeof req.body.desc !== 'string')
            return next(new Error('equis de'));
        req.body.desc = clean(req.body.desc);
    }
    if (req.body.tags) {
        if (typeof req.body.tags !== 'string')
            return next(new Error('equis de'));
        req.body.tags = clean(req.body.tags).split(/[,;]/);
    }
}