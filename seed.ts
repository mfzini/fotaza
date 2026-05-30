import { sequelize } from './src/config/db.js'
import { User, Follow } from './src/models/User.js';
import { Post, Tag, PostTags } from './src/models/Post.js';
import { File } from './src/models/File.js';
import { Rating } from './src/models/Rating.js';
import { Comment } from './src/models/Comment.js';
// Banco de URLs proporcionado
const mediaUrls = [
    "https://uendffjfnpsqvdpvlifs.supabase.co/storage/v1/object/public/fotaza/f6fe6678c39f30a4bd9773b04f5951fe1cfe3f3e91cd8b06bcf2734821101f4d.png",
    "https://uendffjfnpsqvdpvlifs.supabase.co/storage/v1/object/public/fotaza/3224cf0da92cfef1c9275fff5b01a6e20cf99fb15fe7f7c31750517e34374184.png",
    "https://uendffjfnpsqvdpvlifs.supabase.co/storage/v1/object/public/fotaza/9dc2d4b908c69497d79cf1304444e3a56162b43137594dfc61477e42d2f4aac8.png",
    "https://uendffjfnpsqvdpvlifs.supabase.co/storage/v1/object/public/fotaza/93d82fb5c3b9186bef31bbbb9f87ea7e77988758a59b1212501b54c5c81a314b.png",
    "https://uendffjfnpsqvdpvlifs.supabase.co/storage/v1/object/public/fotaza/d308e46d62e5bf572860be8a970a5736d4a9c8687bbaa671e282a7dd1ea6bf33.png",
    "https://uendffjfnpsqvdpvlifs.supabase.co/storage/v1/object/public/fotaza/8d4f42561da175ab47f0259f1ecc9d1b676b499d1ba4ac85346e040aa53b6339.png",
    "https://uendffjfnpsqvdpvlifs.supabase.co/storage/v1/object/public/fotaza/d22ed648abd1c1011242cf3eee6f68a317cd8f0908aeff914c8773170084fd89.png",
    "https://uendffjfnpsqvdpvlifs.supabase.co/storage/v1/object/public/fotaza/b1ea18493ceb0c0f5aaed7831cae90cfcff611cf6a18b7ad9a3d679d0476acf0.png",
    "https://uendffjfnpsqvdpvlifs.supabase.co/storage/v1/object/public/fotaza/928e3df14973fe8bc1717922f798bdcfc6d17ef5e3bf1f68a9f7e2bb64859046.mp4"
];
async function runSeeder() {
    try {
        console.log('⏳ Conectando y sincronizando base de datos...');
        await sequelize.sync({ force: true });
        console.log('✅ Base de datos limpia.');

        // 1. Crear Usuarios (Actualizado: password 'test123' para el usuario test)
        console.log('👥 Creando usuarios...');
        const userTest = await User.create({
            username: 'test',
            password: 'test123', 
            email: 'test@test.dev'
        });

        const userAlice = await User.create({
            username: 'alice_creative',
            password: 'password123',
            email: 'alice@example.com'
        });

        // Relación de seguimiento compuesta
        await Follow.create({ user: userTest.id, target: userAlice.id });

        // 2. Crear Etiquetas
        console.log('🏷️ Creando etiquetas...');
        const tagArt = await Tag.create({ tag: 'art' });
        const tagTech = await Tag.create({ tag: 'tech' });
        const tagDesign = await Tag.create({ tag: 'design' });

        // 3. Crear Publicaciones
        console.log('📝 Creando publicaciones...');
        
        // Post Inicial
        const postOld = await Post.create({
            title: 'Galería de inspiración y video',
            desc: 'Un compilado inicial de recursos interesantes.',
            authorId: userAlice.id
        });

        // Penúltimo Post (Tendrá 3 imágenes)
        const postPenultimate = await Post.create({
            title: 'Revisión de diseño UI/UX',
            desc: 'Analizando las estructuras visuales de las últimas interfaces recibidas.',
            authorId: userAlice.id
        });

        // Último Post (Tendrá 1 imagen)
        const postLatest = await Post.create({
            title: 'Mi última obra conceptual',
            desc: 'La pieza final de la colección de esta semana.',
            authorId: userTest.id
        });

        // REGLA: Cada post debe tener como mínimo una etiqueta
        console.log('🔗 Vinculando etiquetas a cada publicación...');
        await PostTags.create({ postId: postOld.id, tag: tagArt.tag });
        await PostTags.create({ postId: postPenultimate.id, tag: tagTech.tag });
        await PostTags.create({ postId: postPenultimate.id, tag: tagDesign.tag }); // Opcional: más de una
        await PostTags.create({ postId: postLatest.id, tag: tagArt.tag });

        // 4. Poblar Archivos (Files)
        console.log('📁 Distribuyendo imágenes y videos en los posts...');

        // REGLA: Último post -> 1 imagen (Sin watermark para demostrar que no es obligatorio)
        const fileLatest = await File.create({
            hash: 'hash_latest_1',
            url: mediaUrls[0],
            mimetype: 'image/png',
            watermark: undefined, // Omitido / No obligatorio
            postId: postLatest.id
        });

        // REGLA: Penúltimo post -> 3 imágenes (Algunas con watermark, otras no)
        const filePenultimate1 = await File.create({
            hash: 'hash_pen_1',
            url: mediaUrls[1],
            mimetype: 'image/png',
            watermark: 'Borrador Oficial',
            postId: postPenultimate.id
        });
        const filePenultimate2 = await File.create({
            hash: 'hash_pen_2',
            url: mediaUrls[2],
            mimetype: 'image/png',
            watermark: undefined, // Omitido / No obligatorio
            postId: postPenultimate.id
        });
        const filePenultimate3 = await File.create({
            hash: 'hash_pen_3',
            url: mediaUrls[3],
            mimetype: 'image/png',
            watermark: undefined, // Omitido / No obligatorio
            postId: postPenultimate.id
        });

        // Resto de la multimedia va al post antiguo
        for (let i = 4; i < mediaUrls.length; i++) {
            const url = mediaUrls[i];
            const isVideo = url.endsWith('.mp4');
            await File.create({
                hash: `hash_old_${i}`,
                url: url,
                mimetype: isVideo ? 'video/mp4' : 'image/png',
                watermark: isVideo ? undefined : 'Galería general',
                postId: postOld.id
            });
        }

        // 5. Interacciones (Comentarios y Calificaciones)
        console.log('💬 Añadiendo interacciones...');
        await Comment.create({
            text: '¡Wow! Esta única imagen del último post es asombrosa.',
            authorId: userAlice.id,
            fileId: fileLatest.id
        });

        await Rating.create({
            userId: userAlice.id,
            fileId: fileLatest.id,
            value: 5
        });

        console.log('🚀 ¡Base de datos sembrada con éxito!');
    } catch (error) {
        console.error('❌ Error ejecutando el seeder:', error);
    } finally {
        await sequelize.close();
        console.log('🔌 Conexión cerrada.');
    }
}

runSeeder();