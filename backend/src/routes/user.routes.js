import express from 'express'
import {registeruser,loginUser,logoutUser,deleteUser, addToWishlist} from '../Controller/user.controller.js'
import { isUserAuthenticated } from '../middleware/isAuthenticated.js';
const router = express.Router();

router.route("/register").post(registeruser);
router.route("/login").post(loginUser)
router.route("/post-to-wishlist/:videoId").post(isUserAuthenticated,addToWishlist)
router.route("/logout").get(isUserAuthenticated,logoutUser)
router.route("/delete-user/:userId").delete(deleteUser)

export default router