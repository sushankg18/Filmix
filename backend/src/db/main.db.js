import mongoose from "mongoose";
import { User } from "../models/user.model.js"; // Ensure correct import

const DB_NAME = "filmix";
const { MONGO_URI } = process.env;

const dbConnection = async () => {
    try {
        await mongoose.connect(`${MONGO_URI}${DB_NAME}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Database connected..!");

        // // Update existing users to include wishlist
        // const result = await User.updateMany(
        //     { watchLater: { $exists: false } },
        //     { $set: { watchLater: [] } }
        // );
        // console.log(`Updated users: ${result.modifiedCount}`);
    } catch (error) {
        console.error("Database connection error:", error.message);
        throw error; 
    }
};

export default dbConnection;
