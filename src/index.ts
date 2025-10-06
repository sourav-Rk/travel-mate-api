console.log("server starts");
import "reflect-metadata";
import { MongoConnect } from "./infrastructure/database/mongoDB/mongoConnect";
import { App } from "./infrastructure/config/server/server";
import { config } from "./shared/config";
import { cronScheduler } from "./infrastructure/dependencyInjection/resolve";

try {
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
