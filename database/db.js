import mongoose, { mongo } from "mongoose";

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
            //TODO: attempt a reconnection to mdb
        })
    }

    async connect() {
        if(!process.env.MONGO_URI) {
            throw new Error("MONGODB URI is not defined in .env file")
        }

        const connectionOptions = {
            useNewUrlParser: true,  //Tells Mongoose to use the new way of parsing the MongoDB connection string (URL)
            useUnifiedTopology: true,   //Enables the new connection engine (unified topology) that MongoDB introduced
            maxPoolSize: 10,    //Sets the maximum number of connections that can be kept open in the pool
            serverSelectionTimeoutMS: 5000,     //The maximum time (in milliseconds) your app will wait while trying to find a working MongoDB server
            socketTimeoutMS: 45000,     //The maximum time (in milliseconds) a socket (network connection) stays open when waiting for a response
            family: 4       //Whether to connect using IPv4 or IPv6, 4 in this case
        }

        if(process.env.NODE_ENV === 'development') {
            mongoose.set('debug', true)
        }

        await mongoose.connect(process.env.MONGO_URI, connectionOptions)
        this.retryCount = 0;        //set retryCount as 0 bcz connection is successful
    }
}