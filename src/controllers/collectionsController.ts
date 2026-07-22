import type { Request, Response, NextFunction } from "express";
import { User } from "../models/User.js";
import { Collection, CollectionPost } from "../models/Collection.js";
import { Post, Tag } from "../models/Post.js";

export async function collectionsView(req: Request, res: Response, next: NextFunction) {
    const user = req.user as User;
    const collections = await Collection.findAll({
        where: {
            ownerId: user.id
        }, order: [['createdAt', 'ASC']]
    })
    res.render('collections', { collections });
}
export async function renameCollection(req: Request, res: Response) {
    const user = req.user as User;
    const { id, name } = req.body;
    const collection = await Collection.findByPk(id);
    if (!collection) return res.status(404).end();
    if (collection.isFavorite) return res.status(403).end();
    if (collection.ownerId != user.id) return res.status(403).end();
    collection.name = name;
    await collection.save();
    res.status(200).end();
}
export async function deleteCollection(req: Request, res: Response) {
    const user = req.user as User;
    const { id } = req.body;
    const collection = await Collection.findByPk(id);
    if (!collection) return res.status(404).end();
    if (collection.isFavorite) return res.status(403).end();
    if (collection.ownerId != user.id) return res.status(403).end();
    await collection.destroy();
    res.status(200).end();
}

export async function createCollection(req: Request, res: Response, next: NextFunction) {
    const u = (req.user as User);
    const { name } = req.body;
    const collection = await Collection.create({ ownerId: u.id, name });
    res.status(201).json({ location: `/collection/${collection.id}` });
}

export async function getCollection(req: Request, res: Response, next: NextFunction) {
    const collectionId = req.params.id as string;
    const userId = (req.user as User).id;
    const collection = await Collection.findOne({
        where: {
            ownerId: userId,
            id: collectionId
        }, include: [{
            model: Post,
            include: [User, Tag]
        }]
    });
    if (!collection) return next(new Error('Colección no encontrada.'));
    res.render('collection', { collection });
}

export async function collectionAddPost(req: Request, res: Response, next: NextFunction) {
    const postId = req.params.id as string;
    const { collectionId } = req.body;
    const user = req.user as User;
    const collection = await Collection.findOne({ where: { id: collectionId } });
    const post = await Post.findByPk(postId);
    if (!collection || !post) {
        res.status(404);
        return next(new Error('No es posible encontrar uno de los recursos solicitados.'));
    }

    const n = await CollectionPost.count({
        where: {
            collectionId,
            postId
        }
    });
    if (n > 0) {
        res.status(400);
        return next("Ese post ya se encuentra en esa colleción.");
    }

    await collection.$add('posts', post);
    res.redirect(`/post/${postId}`);
}

export async function collectionRemovePost(req: Request, res: Response, next: NextFunction) {
    const collectionId = req.params.id as string;
    const { postId } = req.body;
    const user = req.user as User;
    const collection = await Collection.findOne({ where: { id: collectionId } });
    const post = await Post.findByPk(postId);
    if (!collection || !post) return res.status(404).end();
    if (collection?.ownerId != user.id) return res.status(400).end();
    try {
        await collection.$remove('post', post);
        res.status(200).end();
    } catch (e) {
        console.error(e);
        res.status(500).end();
    }
}

