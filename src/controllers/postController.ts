import type { NextFunction, Request, Response } from 'express';
import { upload } from '../config/s3.js';
import { File } from '../models/File.js';
import { Post, Tag } from '../models/Post.js';
import { User } from '../models/User.js';
import type { UUID } from 'crypto';
import { sha256 } from '../utils/sha256.js';
import { sequelize } from '../config/db.js';
import { Comment } from '../models/Comment.js';
import { Rating } from '../models/Rating.js';

export async function getCreatePost(req: Request, res: Response, next: NextFunction) {
    res.render('createPost');
}

export async function postCreatePost(req: Request, res: Response, next: NextFunction) {
    const authorId: UUID = (req.user as User).id as UUID;
    const { title, desc } = req.body;
    const watermarks = new Map(Object.entries(JSON.parse(req.body.watermarks)));
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
            const mimetype: string = f.mimetype;
            if (!url) return next(new Error("Algo malió sal."));
            const watermark = watermarks.get(f.originalname);
            const r = await File.create({
                hash, url, mimetype, watermark, postId: post.id
            }, { transaction });
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
    let posts = await Post.fetchAllByPk(id);
    return res.render('post', posts?.toJSON());
}
