import { sequelize } from './src/config/db.js'
import { User, Follow } from './src/models/User.js';
import { Post, Tag, PostTags } from './src/models/Post.js';
import { File } from './src/models/File.js';
import { Rating } from './src/models/Rating.js';
import { Comment } from './src/models/Comment.js';
import { ReportComment, ReportFile, ReportReason } from './src/models/Reports.js';
import { Role } from './src/models/Role.js';
import { Mail } from './src/models/Mail.js';
// Banco de URLs proporcionado
const mediaUrls = [
    "https://uendffjfnpsqvdpvlifs.supabase.co/storage/v1/object/public/fotaza/f6fe6678c39f30a4bd9773b04f5951fe1cfe3f3e91cd8b06bcf2734821101f4d.png",
    "https://uendffjfnpsqvdpvlifs.supabase.co/storage/v1/object/public/fotaza/3224cf0da92cfef1c9275fff5b01a6e20cf99fb15fe7f7c31750517e34374184.png",
    "https://uendffjfnpsqvdpvlifs.supabase.co/storage/v1/object/public/fotaza/928e3df14973fe8bc1717922f798bdcfc6d17ef5e3bf1f68a9f7e2bb64859046.mp4"
];
async function runSeeder() {
    try {
        await sequelize.sync({ force: true });
        const reportReasons: ReportReason[] = [];
        ['NSFW', 'Spam', 'Plagio'].forEach(async reason => reportReasons.push(await ReportReason.create({ reason })));
        const roles = [];
        ['user', 'mod'].forEach(async role => roles.push(await Role.create({ name: role })));
        const tags: Tag[] = [];
        ['teclados', 'videito'].forEach(async tag => tags.push(await Tag.create({ tag })));

        const userTest = await User.create({
            username: 'test',
            password: 'test123',
            email: 'test@test.dev',
        });
        userTest.$add('role', 'mod')
        const userBaneado = await User.create({
            username: 'baneado',
            password: 'baneado',
            email: 'baneado@example.com',
            strikes: 3
        });

        const userAlice = await User.create({
            username: 'alice_creative',
            password: 'password123',
            email: 'alice@example.com'
        });

        const email_alice_test = await Mail.create({
            fromId: userAlice.id,
            toId: userTest.id,
            subject: 'Primer mail!',
            message: "Vamo lo pibeee!"
        });

        const userBob = await User.create({
            username: 'bob_builder',
            password: 'password123',
            email: 'bob@example.com'
        });

        const userCharlie = await User.create({
            username: 'charlie_gamer',
            password: 'charliepassword',
            email: 'charlie@example.com'
        });

        const userDiana = await User.create({
            username: 'diana_dev',
            password: 'dianapassword',
            email: 'diana@example.com'
        });

        const firstPost = await Post.create({
            title: 'Primer post!',
            desc: 'Primer post!!!',
            authorId: userTest.id,
        });
        await firstPost.$add('tag', tags[0]);

        const file_0 = await File.create({
            hash: 'membrana',
            location: mediaUrls[0],
            mimetype: 'image/png',
            postId: firstPost.id,
            originalName: 'teclado_ergonomico.png',
            watermark: 'fotaza'
        });

        const file_1 = await File.create({
            hash: 'mecanico',
            location: mediaUrls[1],
            mimetype: 'image/png',
            postId: firstPost.id,
            originalName: 'teclado_mecanico.png'
        });


        const secondPost = await Post.create({
            title: 'Segundo post!',
            desc: 'Segundo post!!!',
            authorId: userAlice.id
        });
        await secondPost.$add('tag', tags[1]);

        const file_2 = await File.create({
            hash: 'mp4',
            location: mediaUrls[2],
            mimetype: 'video/mp4',
            postId: secondPost.id,
            originalName: 'videito',
        });

        [userBob.id, userCharlie.id, userDiana.id].forEach(async userId => {
            await ReportFile.create({ userId, fileId: file_0.id, reasonId: reportReasons[0].id });
            await ReportFile.create({ userId, fileId: file_1.id, reasonId: reportReasons[0].id });
        });

        const comment_0 = await Comment.create({
            text: 'Primer comentario!',
            authorId: userAlice.id,
            fileId: file_0.id
        });
        [userBob.id, userCharlie.id, userDiana.id].forEach(async userId => {
            await ReportComment.create({ userId, commentId: comment_0.id, reasonId: reportReasons[0].id });
        });

        await Rating.create({
            userId: userAlice.id,
            fileId: file_0.id,
            value: 5
        });

        console.log('Todo OK');
    } catch (error) {
        console.error('❌ Error ejecutando el seeder:', error);
    } finally {
        await sequelize.close();
        console.log('🔌 Conexión cerrada.');
    }
}

runSeeder();