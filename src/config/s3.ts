import { HeadObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

const client = new S3Client({
    forcePathStyle: true,
    region: process.env.S3_REGION!,
    endpoint: process.env.S3_ENDPOINT!,
    credentials: {
        accessKeyId: process.env.S3_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_KEY!
    }
})
const prefix = process.env.S3_BUCKET!;

export async function upload(file: Express.Multer.File, hash: string) {
    const name: string = `${hash}.${file.mimetype.split('/')[1]}`
    const location: string = `${prefix}/${name}`
    let result = await checkFile('fotaza', name);
    if (result) return location;
    try {
        const r = await new Upload({
            client, params: {
                Bucket: 'fotaza',
                Key: name,
                ContentType: file.mimetype,
                Body: file.buffer,
            }
        }).done();
        return location;
    } catch (e) {
        console.error(e);
    }
}

const checkFile = async (bucket: string, key: string) => {
    try {
        const command = new HeadObjectCommand({
            Bucket: bucket,
            Key: key,
        });
        return await client.send(command);
    } catch (error) {
        console.error(error);
    }
};