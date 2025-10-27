import mongoose from "mongoose";

const MAX_RETRIES = 3
const RETRY_INTERVAL = 5000 //5 seconds

class DatabaseConnection {
    constructor() {
        this.retryCount = 0;
        this.isConnected = false;

        //configure mongoose settings
        mongoose.set('strictQuery', true)   //strictQuery is useful when extracting data from db, and basically only search for the fields that are in the schema and remove those that are extra
    }
}