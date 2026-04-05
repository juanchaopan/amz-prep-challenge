import { createClient, RedisClientOptions, type RedisClientType } from "redis";
import { redisDb, redisHost, redisPassword, redisPort } from "./constants";

const redisOptions: RedisClientOptions = {
    socket: {
        host: redisHost,
        port: Number(redisPort),
    },
    database: Number(redisDb),
    password: redisPassword
};


const redisClient = createClient(redisOptions);

redisClient.on("error", (error) => {
    console.error("Redis client error:", error);
});

async function connectRedis(): Promise<void> {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
}

async function disconnectRedis(): Promise<void> {
    if (redisClient.isOpen) {
        await redisClient.quit();
    }
}

export { redisClient, connectRedis, disconnectRedis };
