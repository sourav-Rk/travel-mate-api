import "reflect-metadata";
import { MongoConnect } from "./infrastructure/database/mongoDB/mongoConnect";
import { App } from "./infrastructure/config/server/server";
import { config } from "./shared/config";
import {
  chatSocketHandler,
  groupChatSocketHandler,
  cronScheduler,
} from "./infrastructure/dependencyInjection/resolve";
import { createServer } from "http";
import { configureSocket } from "./infrastructure/config/socket/socket";
import { Server } from "socket.io";
import { container } from "tsyringe";
import { ITokenService } from "./domain/service-interfaces/token-service.interface";

try {
  const app = new App();
  const expressApp = app.getApp();

  const httpServer = createServer(expressApp);

  const mongoConnect = new MongoConnect();

  const tokenService = container.resolve<ITokenService>("ITokenService");

  mongoConnect
    .connectDB()
    .then(() => console.log("mongodb connected"))
    .catch((error) => console.log(error));

  cronScheduler.startAll();

  const io = new Server(httpServer, {
    cors: {
      origin: config.client.uri,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  configureSocket(io, chatSocketHandler, groupChatSocketHandler, tokenService);

  httpServer.listen(config.server.PORT, () =>
    console.log(`server running at port ${config.server.PORT} `)
  );
} catch (error) {
  console.log(error);
}
