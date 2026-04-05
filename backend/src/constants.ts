const nvidiaApiKey = process.env.NVIDIA_API_KEY ?? "";
const nvidiaBaseUrl = process.env.NVIDIA_BASE_URL ?? "";
const nvidiaLanguageModel = process.env.NVIDIA_LANGUAGE_MODEL ?? "";

const mongoUri = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`;
const mongoDb = process.env.MONGO_DB ?? "";
const mongoDbUsername = process.env.MONGO_DB_USERNAME ?? "";
const mongoDbPassword = process.env.MONGO_DB_PASSWORD ?? "";

const redisHost = process.env.REDIS_HOST ?? "";
const redisPort = process.env.REDIS_PORT ?? "";
const redisDb = process.env.REDIS_DB ?? "";
const redisPassword = process.env.REDIS_PASSWORD ?? "";

export {
    nvidiaApiKey,
    nvidiaBaseUrl,
    nvidiaLanguageModel,
    mongoUri,
    mongoDb,
    mongoDbUsername,
    mongoDbPassword,
    redisHost,
    redisPort,
    redisDb,
    redisPassword
};