import type { NextFunction, Request, Response } from 'express';
import { upload } from '../config/s3.js';
import { File } from '../models/File.js';
import { Post, Tag } from '../models/Post.js';
import { User } from '../models/User.js';
import type { UUID } from 'crypto';
import { sha256 } from '../utils/sha256.js';
import { sequelize } from '../config/db.js';

export async function getCreatePost(req: Request, res: Response, next: NextFunction) {
    res.render('createPost');
}

export async function postCreatePost(req: Request, res: Response, next: NextFunction) {
    const authorId: UUID = (req.user as User).id as UUID;
    const { title, desc } = req.body;
    const transaction = await sequelize.transaction();
    try {
        const post = await Post.create({
            authorId,
            title,
            desc
        }, { transaction });


        const FilePromises = (req.files as Express.Multer.File[]).map(async (f) => {
            const hash = sha256(f.buffer);
            const url = await upload(f, hash); // esto hay que cambiar para usar promesas.
            const mimetype: string = f.mimetype;

            if (!url) return next(new Error("Algo malió sal.")); // esto va en otro lado.

            return File.findOrCreate({
                where: { hash },
                defaults: { hash, url, mimetype },
                transaction
            });
        });

        const tagPromises = req.body.tags.map(async (tag: string)=> {
            return Tag.findOrCreate({
                where: { tag },
                defaults: { tag },
                transaction
            })
        });

        /* for (let f of req.files as Express.Multer.File[]) {
            const hash = sha256(f.buffer);
            const url = await upload(f, hash);
            const mimetype: string = f.mimetype;

            if (!url) return next(new Error("Algo malió sal."));

            const [r] = await File.findOrCreate({
                where: { hash },
                defaults: { hash, url, mimetype },
                transaction
            }); */

        /* for (const tag of req.body.tags) {
            const [r] = await Tag.findOrCreate({
                where: { tag },
                defaults: { tag },
                transaction
            });
            await post.$add('tags', r, { transaction });
        } */
        const files = await Promise.all(FilePromises);
        const tags = Promise.all(tagPromises);
        await post.$add('files', files, { transaction });
        await post.$add('tags', await tags, { transaction });
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
    const dto = await Post.fetchAllByPk(id);
    if (!dto) res.end();
    res.render('post', dto?.toJSON());
}