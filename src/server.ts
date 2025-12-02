import { App } from "./app";
import { ConnectMongo } from "./config/database";
import { env } from "./config/env";

const app = new App();
const database = new ConnectMongo();

database.connectDB();

app.getApp().listen(env.PORT,()=>console.log(`server running on port ${env.PORT}`));