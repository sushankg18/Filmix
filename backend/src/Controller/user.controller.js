import { User } from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import sendMail from '../helper/sendMail.js';
import { welcomeEmail } from '../helper/welcomeEmail.js';
import { otpVerify } from '../helper/otpVerify.js'


export const registeruser = async (req, res) => {

    try {
        const { fullname, password, email } = req.body;
        const requiredFields = [fullname, email, password,];

        if (requiredFields.some((field) => !field.trim())) {
            return res.status(403).json({ message: "Please fill the all fields to create account" })
        };

        const existedUser = await User.findOne({ email })
        if (existedUser) {
            return res.status(401).json({ message: "User with this email is already Existed!" })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            fullname,
            email,
            password: hashedPassword,
        });

        if (user) {
            sendMail(email, "Welcome to Filmix movie database", "", welcomeEmail(fullname))
            return res.status(200).json({ user, message: "User Created Successfully!" })
        }

    } catch (error) {
        console.log("Error while creating user : ", error)
    }
};

export const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;

        const requiredFields = [email, password];
        if (requiredFields.some((fields) => !fields.trim())) {
            return res.status(401).json({ message: "Please fill all the fields to login" })
        };

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "User not found, Please check the email again." })
        };

        const isPassMatched = await bcrypt.compare(password, user.password)
        if (!isPassMatched) {
            return res.status(403).json({ message: "Invalid Email or Password" })
        };

        const tokenData = {
            userId: user._id
        }
        const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })

        const logInUser = await User.findOne({ email }).select("-password")
        return res.status(200)
            .cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "strict" })
            .json({
                message: "User Logged in successfully ",
                success: true,
                logInUser
            })

    } catch (error) {
        console.log("Error Logging user : ", error)
    }
};

// Export a function called verifyEmail which takes in a request and response object
export const verifyEmail = async (req, res) => {

    // Destructure the userEmail and username from the request parameters
    const { userEmail, username } = req.params;
    // Destructure the userTypedOtp from the request body
    const { userTypedOtp } = req.body;

    const user = await User.findOne({ email: userEmail }).select("isEmailVerified verificationCode verificationCodeExpiry");
    let otp = '';

    try {
        if (userTypedOtp === '') {

            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const length = 6;
            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                otp += characters[randomIndex];
            }

            const expiryTime = new Date(Date.now() + 5 * 60 * 1000);
            user.verificationCode = otp;
            user.verificationCodeExpiry = expiryTime;

            await user.save();

            console.log("OTP IS: ", otp);
            sendMail(userEmail, "Email verification", "", otpVerify(username, otp));

            return res.status(201).json({ message: "Verification code sent to your email." });
        } else {

            if (!user.verificationCode || !user.verificationCodeExpiry) {
                return res.status(400).json({ message: "OTP not found, please request a new one." });
            }

            if (Date.now() > user.verificationCodeExpiry) {
                user.verificationCode = null;
                user.verificationCodeExpiry = null;
                await user.save();
                return res.status(400).json({ message: "Verification code expired. Please try again." });
            }

            if (userTypedOtp === user.verificationCode) {
                user.isEmailVerified = true;
                user.verificationCode = null;
                user.verificationCodeExpiry = null;

                await user.save();
                const verifiedUser = await User.findOne({ email: userEmail }).select("-password");
                return res.status(200).json({
                    message: "Email verified successfully", user: verifiedUser
                });
            } else {
                return res.status(400).json({ message: "Invalid OTP. Please try again." });
            }
        }
    } catch (error) {
        console.log("Backend error while OTP verification: ", error);
        return res.status(500).json({ message: "Internal Server Error", error });
    }
}


export const logoutUser = async (req, res) => {
    try {
        return res.status(200)
            .cookie('token', " ", { maxAge: 0 })
            .json({
                message: "User logout Successfully!"
            });
    } catch (error) {
        console.log("Error while logout : ", error);
        return res.status(405).json({
            message: "PROBLEM WHILE LOGOUT",
            error
        })
    };
};

export const updateUser = async (req, res) => {

    try {
        const { userId } = req.params;
        const loggedInuser = req.id;

        const { username, password, email, bio } = req.body;

        if (loggedInuser != userId) {
            return res.status(403).json({
                message: "Unauthorized Request"
            })
        };

        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(401).json({
                message: "User not found!"
            })
        };

        let profilePhotoUrl;
        if (req.file) {
            console.log("Req.file : ", req.file)
            const result = await uploadOnCloudinary(req.file.path);
            profilePhotoUrl = result.secure_url;
        }

        if (username) user.username = username;
        if (email) user.email = email;
        if (profilePhotoUrl) user.profilePhoto = profilePhotoUrl;
        if (bio) user.bio = bio;
        if (password) {
            const newPass = await bcrypt.hash(password, 10);
            user.password = newPass;
        }

        await user.save()
        const updatedUser = await User.findById(userId).select("-password")
        return res.status(200).json({
            message: "User updated successfully",
            updatedUser
        })

    } catch (error) {
        console.log("Error while updating user details : ", error.message);
    }
}

export const AddandRemoveFromwatchlater = async (req, res) => {
    try {

        const userId = req.id;

        const { videoId } = req.params;

        //checks if user logged In or not
        if (!userId) {
            return res.status(402).json({ message: "Please login to remove anything from watchlater.!" })
        }

        //checks if videoId exists or not
        if (!videoId) return res.status(402).json({ message: "Invalid video id " })


        const user = await User.findById(userId).select("watchlater")
        //checks if user exist or not
        if (!user) return res.status(400).json({ message: "No user found..!" })


        //checking if the videoId stored in database or not
        if (user.watchlater.includes(videoId)) {
            user.watchlater = user.watchlater.filter(data => data.toString() !== videoId.toString());
            await user.save()

            const updatedUser = await User.findById(userId).select("-password")
            return res.status(200).json({ message: "Video removed from watchlater", updatedUser })

        } else {
            user.watchlater.push(videoId)
            await user.save()
            const updatedUser = await User.findById(userId).select("-password")
            return res.status(201).json({ message: "video added to watchlater.!", updatedUser })
        }

    } catch (error) {
        console.log("Error while removing from watchlater", error)
        return res.status(400).json({ message: "got error while removing video from watchlater " })
    }

}

export const addSeriesToFavOrRev = async (req, res) => {
    try {
        const userId = req.id;

        const { videoId } = req.params;

        //checks if user logged In or not
        if (!userId) {
            return res.status(402).json({ message: "Please login to remove anything from watchlater.!" })
        }

        //checks if videoId exists or not
        if (!videoId) return res.status(402).json({ message: "Invalid video id " })


        const user = await User.findById(userId).select("watchlater_series")
        //checks if user exist or not
        if (!user) return res.status(400).json({ message: "No user found..!" })


        //checking if the videoId stored in database or not
        if (user.watchlater_series.includes(videoId)) {
            user.watchlater_series = user.watchlater_series.filter(data => data.toString() !== videoId.toString());
            await user.save()

            const updatedUser = await User.findById(userId).select("-password")
            return res.status(200).json({ message: "Video removed from watchlater", updatedUser })

        } else {
            user.watchlater_series.push(videoId)
            await user.save()
            const updatedUser = await User.findById(userId).select("-password")
            return res.status(201).json({ message: "video added to watchlater.!", updatedUser })
        }
    } catch (error) {
        console.log("Error while removing from watchlater", error)
        return res.status(400).json({ message: "got error while removing video from watchlater " })
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        await User.deleteOne({ _id: userId })
        console.log("FInally account deleted successfully")
        return res.status(200)
            .cookie('token', " ", { maxAge: 0 })
            .json({
                message: "Account deleted successfully"
            })
    } catch (error) {
        console.log("Error while deleting user : ", error.message)
        return res.status(200).json({
            message: "Internal server Error 404"
        })
    }
}

export const userPasswordChecker = async (req, res) => {
    try {

        const { userId } = req.params;
        const loggedInuser = req.id;

        const { password } = req.body

        if (loggedInuser !== userId) {
            return res.status(403).json({
                message: "Unauthorized Request!!"
            })
        };

        if (!password) {
            return res.status(402).json({
                message: "Password is required for deleting account !"
            })
        };


        const user = await User.findById(userId)

        if (!user) {
            return res.status(402).json({
                message: "User not found"
            })
        };

        const isPassValid = await bcrypt.compare(password, user.password)
        if (!isPassValid) {
            return res.status(401).json({
                message: "Incorrect password"
            })
        };

        return res.status(200).json({
            message: "Correct password"
        })
    } catch (error) {
        console.log("Error while checking password : ", error);
        return res.status(500).json({
            message: "Internal Server error while checking the password",
            error
        })
    }
}
