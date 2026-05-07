import { createClient } from 'redis';
import { RedisStore } from 'connect-redis';
import { configDotenv } from 'dotenv';
configDotenv({path: '.env.redis'});

const redisClient = createClient({
    url: process.env.REDIS_URL!
})

redisClient.on("error", (err) => {
    console.error("Redis explotó:", err)
    process.exit(1);
});

redisClient.connect().catch(console.error);

export const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'myapp:'
});
