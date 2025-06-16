import express from 'express'
import {registeruser,loginUser,logoutUser,deleteUser, AddandRemoveFromwatchlater, verifyEmail,addSeriesToFavOrRev} from '../Controller/user.controller.js'
import { isUserAuthenticated } from '../middleware/isAuthenticated.js';
const router = express.Router();

router.route("/register").post(registeruser);
router.route("/login").post(loginUser)
router.route("/verify-email/:userEmail/:username").post(verifyEmail)
router.route("/logout").get(isUserAuthenticated,logoutUser)
router.route("/delete-user/:userId").delete(deleteUser)
router.route("/add-or-remove-from-wishlist/:videoId").post(isUserAuthenticated,AddandRemoveFromwatchlater)
router.route("/add-or-remove-series-from-watchlater/:videoId").post(isUserAuthenticated,addSeriesToFavOrRev)

export default router