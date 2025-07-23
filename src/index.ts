import "reflect-metadata";
import { App } from "./frameworks/http/server";
import { MongoConnect } from "./frameworks/database/mongoDB/mongoConnect";
import { config } from "./shared/config";

try{
  const app = new App();
const mongoConnect = new MongoConnect();

mongoConnect
  .connectDB()
  .then(() => console.log("mongodb connected"))
  .catch((error) => console.log(error));

app
  .getApp()
  .listen(config.server.PORT, () =>
    console.log(`server running at port ${config.server.PORT}`)
  );


}catch(error){
  console.log(error)
}
