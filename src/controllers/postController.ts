import type { NextFunction, Request, Response } from 'express';
import { upload } from '../config/s3.js';
import { File } from '../models/File.js';
import { Post, Tag } from '../models/Post.js';
import { Interest, User } from '../models/User.js';
import type { UUID } from 'crypto';
import { sha256 } from '../utils/sha256.js';
import { sequelize } from '../config/db.js';
import { normalize } from '../utils/sCleaner.js';
import { Collection, CollectionPost } from '../models/Collection.js';
import { ReportComment, ReportFile, ReportReason } from '../models/Reports.js';
import { Rating } from '../models/Rating.js';
import { Comment } from '../models/Comment.js';
import { Op } from 'sequelize';

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
            const location = await upload(f, hash);
            const mimetype: string = f.mimetype;
            const originalName = f.originalname;
            if (!location) return next(new Error("Algo malió sal."));
            const watermark = watermarks.get(hash);
            const r = await File.create({
                hash, location, mimetype, watermark, postId: post.id, originalName
            }, { transaction });
        }

        for (let tag of req.body.tags) {
            tag = normalize(tag);
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
    const user: User = req.user as User;
    const id: string = req.params.id as string;
    if (!id) res.status(404).end();
    let post;
    post = await Post.findByPk(id, {
        include: [
            User,
            Tag,
            {
                model: File,
                include: [{ model: Rating, as: 'ratings' }, ...(user ? [{
                    model: Interest,
                    where: { userId: user.id },
                    required: false
                }] : []),
                {
                    model: Comment,
                    order: [['createdAt', 'ASC']],
                    include: [User, ...(user ? [{
                        model: ReportComment,
                        where: { userId: user.id },
                        required: false
                    }] : [])],
                    separate: true
                },
                ...(user ? [{
                    model: ReportFile,
                    where: {
                        userId: user.id
                    },
                    required: false
                }] : [])
                ]
            }]
    });

    if (!post) return next(new Error("Post no encontrado."));
    let collections, reportReasons;
    const userId = (req.user as User)?.id;
    if (userId) {
        collections = await Collection.findAll({
            where: {
                ownerId: userId, id: {
                    [Op.notIn]: (await CollectionPost.findAll({
                        attributes: ['collectionId'],
                        where: { postId: id },
                    })).map((cp) => cp.collectionId),
                },
            }, attributes: ['id', 'name']
        });
        reportReasons = await ReportReason.findAll();
    }
    return res.render('post', { post, collections, reportReasons });
}

export async function deletePost(req: Request, res: Response, next: NextFunction) {
    const user = req.user as User;
    if (!user) return res.status(403).end();
    const postId = req.params.id as string;
    if (!postId) return res.status(400).end();
    const post = await Post.findByPk(postId);
    if (!post) return res.status(404).end();
    if (post.authorId != user.id) return res.status(403).end();

    await post.destroy();
    return res.status(200).end();
}

export async function toggleComments(req: Request, res: Response, next: NextFunction) {
    const userId = (req.user as User).id;
    const postId = req.params.id as string;
    const post = await Post.findByPk(postId);
    if (!post) return res.status(404).end();
    if (userId != post.authorId) return res.status(403).end();
    post.canBeCommented = !post.canBeCommented;
    await post.save();
    return res.status(200).json({ newValue: post.canBeCommented });
}
