import { User } from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const registeruser = async (req, res) => {

    try {
        const { fullname, password, email } = req.body;
        const requiredFields = [fullname, email, password,];

        if (requiredFields.some((field) => !field.trim())) {
            return res.status(400).json({ message: "All fields are required!" })
        };

        const existedUser = await User.findOne({ email })
        if (existedUser) {
            return res.status(400).json({ message: "User with this email is already Existed!" })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            fullname,
            email,
            password: hashedPassword,
        });

        if (user) {
            return res.status(200).json({ user, message: "User Created Successfully!" })
            console.log("Account created successfully !!!!! ")
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
            return res.status(401).json({ message: "Please fill all fields!" })
        };

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "User not found" })
        };

        const isPassMatched = await bcrypt.compare(password, user.password)
        if (!isPassMatched) {
            return res.status(401).json({ message: "Password is not matched" })
        };

        const tokenData = {
            userId: user._id
        }
        const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })

        const logInUser = await User.findOne({ email }).select("-password")
        return res.status(200)
            .cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "strict" })
            .json({
                message: "User Logged in successfully !",
                success: true,
                logInUser
            })

    } catch (error) {
        console.log("Error Logging user : ", error)
    }
};

export const logoutUser = async (req, res) => {
    try {
        return res.status(200)
            .cookie('token', " ", { maxAge: 0 })
            .json({
                message: "User logout Successfully!"
            });
    } catch (error) {
        console.log("Error while logout : ", error);
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

export const addToWishlist = async (req, res) => {
    const loggedInuser = req.id;
    const { videoId } = req.params;

    try {

        const user = await User.findById(loggedInuser).select("-password");
        if (!user) {
            return res.status(402).json({ message: "User doesn't exist" })
        }else{
            console.log("USER IS : ",user)
        }
        
        // const videoUrl = `https://api.themoviedb.org/3/movie/${videoId}`

        if (user.wishlist.includes(videoId)) {
            return res.status("201").json({ message: "Video is already in favorite" })
        }
        await user.wishlist.push(videoId)

        await user.save()

        return res.status("200").json({ message: "Video is successfully added to your favorite",user})
    } catch (error) {
        console.log("error while adding video to wishlist : ",error)
        return res.status("400").json({message : "Error while adding video to favorite", error});
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
