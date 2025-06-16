import mongoose from "mongoose";
import { User } from '../models/user.model.js'
const DB_NAME = "filmix";
const { MONGO_URI } = process.env;

const dbConnection = async () => {
    try {
        await mongoose.connect(`${MONGO_URI}${DB_NAME}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Database connected..!");
        
        // after updating code is written below (agar koi changes krne ho future me to commented code ko thik krke wapas commented kr dena hai)
        // await User.updateMany(
        //     { watchlater_series: { $exists: false } }, // jinke paas ye field nahi hai
        //     { $set: { watchlater_series: [] } } // default empty array
        // );


    } catch (error) {
        console.error("Database connection error:", error.message);
        throw error;
    }
};

export default dbConnection;
