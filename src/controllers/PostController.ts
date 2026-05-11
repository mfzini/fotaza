import type { NextFunction, Request, Response } from 'express';
import { upload } from '../config/s3.js';
import { File } from '../models/File.js';
import { Post, Tag } from '../models/Post.js';
import { type PublicUser } from '../models/User.js';
import type { UUID } from 'crypto';
import { sha256 } from '../utils/sha256.js';
import { sequelize } from '../config/db.js';

export async function getCreatePost(req: Request, res: Response, next: NextFunction) {
    res.render('createPost');
}

export async function postCreatePost(req: Request, res: Response, next: NextFunction) {
    const authorId: UUID = (req.user as PublicUser).id as UUID;
    const { title, desc } = req.body;
    const transaction = await sequelize.transaction();
    try {
        const post = await Post.create({
            authorId,
            title,
            desc
        }, { transaction });

        for (let f of req.files as Express.Multer.File[]) {
            const hash = sha256(f.buffer);
            const url = await upload(f, hash);
            const mimetype : string = f.mimetype;

            if (!url) return next(new Error("Algo malió sal."));
            
            const [r] = await File.findOrCreate({
                where: { hash },
                defaults: { hash, url, mimetype },
                transaction
            });
            await post.$add('files', r, { transaction });
        }

        for (const tag of req.body.tags) {
            const [r] = await Tag.findOrCreate({
                where: { tag },
                defaults: { tag },
                transaction
            });
            await post.$add('tags', r, { transaction });
        }
        await transaction.commit();
        res.redirect(`/post/${post.id}`);
    } catch (e) {
        transaction.rollback();
        console.error(e);
        next(Error('Algo malió sal. Intentelo nuevamente más tarde.'));
    }
}

export async function viewPost(req: Request, res: Response, next: NextFunction) {
    const id: string = req.params.id as string;
    const post: Post | null = await Post.findByPk(id);
    const dto = await post?.getDTO();
    if (!dto) res.end();
    res.render('post', dto);
}