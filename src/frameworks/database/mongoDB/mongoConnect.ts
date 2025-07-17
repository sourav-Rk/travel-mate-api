import mongoose from "mongoose";
import { config } from "../../../shared/config";

export class MongoConnect {
    private _dburl : string;
    constructor(){
        this._dburl = config.database.URI;
    }

    async connectDB(){
        try{
            await mongoose.connect(this._dburl);
            console.log('db connected successfully');

            mongoose.connection.on('error',(error) => {
                console.log('MongoDB connection error',error)
            })

            mongoose.connection.on('disconnected',()=>{
                console.log('MongoDB disconnected')
            })
        }catch(error){
            console.log("Failed to connect mongoDB",error)
        }
    }
}