
import mongoose from "mongoose"
import dotenv from 'dotenv';
dotenv.config(); 



export const connectDB = async () => {


    try {
        
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected: ${conn.connection.host} `);
        return conn; // Return the connection to be used for GridFS in the server

        

        
        
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(1);
        
    }
}