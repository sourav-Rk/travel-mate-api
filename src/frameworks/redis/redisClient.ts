import dotenv from 'dotenv';
import { createClient } from "redis";

import { config } from "../../shared/config";

dotenv.config();

const redisClient = createClient({
    url : config.redis.URL
});

redisClient.on("error",(err) => console.log("Redis error : ",err));

void (async() =>{
    await redisClient.connect();
    console.log("✅ Redis connected successfully!");
})();

export default redisClient;