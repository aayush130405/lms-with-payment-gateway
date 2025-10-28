import mongoose from "mongoose";

const MAX_RETRIES = 3
const RETRY_INTERVAL = 5000 //5 seconds

class DatabaseConnection {
    constructor() {
        this.retryCount = 0;
        this.isConnected = false;

        //configure mongoose settings
        mongoose.set('strictQuery', true)   //strictQuery is useful when extracting data from db, and basically only search for the fields that are in the schema and remove those that are extra

        mongoose.connection.on('connected', () => {
            console.log("MONGODB is CONNECTED");
            this.isConnected = true;
        })
        mongoose.connection.on('error', () => {
            console.log("MONGODB connection ERROR");
            this.isConnected = false;
        })
        mongoose.connection.on('disconnected', () => {
            console.log("MONGODB is DISCONNECTED");
            this.isConnected = false;
            //TODO: attempt a reconnection
        })
    }
}