import { createClient } from "redis";
import { config } from "../../shared/config";
import dotenv from 'dotenv';

dotenv.config();

const redisClient = createClient({
    url : config.redis.URL
});

redisClient.on("error",(err) => console.log("Redis error : ",err));

(async() =>{
    await redisClient.connect();
    console.log("✅ Redis connected successfully!");
})();

export default redisClient;