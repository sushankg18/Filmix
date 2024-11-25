import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
        },
        wishlist : [{
            type : Number,
            default : [],
            unique : true
        }],
        watchLater : [{
            type : Number,
            default : [],
            unique : true
        }]
    }
    , { timestamps: true })


export const User = mongoose.model("User", UserSchema)
