console.log("server starts")
import "reflect-metadata";
import { MongoConnect } from "./frameworks/database/mongoDB/mongoConnect";
import { App } from "./frameworks/http/server";
import { config } from "./shared/config";
import { cronScheduler } from "./frameworks/di/resolve";

try {
  console.log("server starts")
  const app = new App();
  const mongoConnect = new MongoConnect();

  mongoConnect
    .connectDB()
    .then(() => console.log("mongodb connected"))
    .catch((error) => console.log(error));

  cronScheduler.startAll();

  app
    .getApp()
    .listen(config.server.PORT, () =>
      console.log(`server running at port ${config.server.PORT}`)
    );
} catch (error) {
  console.log(error);
}
