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
        isEmailVerified : {
            type : Boolean
        },
        verificationCode : {
            type : String,
            select : false
        },
        verificationCodeExpiry : {
            type : Date,
            select : false
        },
        password: {
            type: String,
            required: true,
        },
        watchlater : [{
            type : Number,
            default : [],
            unique : true
        }],
        watchlater_series: [{
            type : Number,
            default : [],
            unique : true
        }]
    }
    , { timestamps: true })


export const User = mongoose.model("User", UserSchema)
