import express from 'express'
import { contactUs } from '../Controller/contact.controller.js';

const router = express.Router();

router.route("/feedback").post(contactUs)

export default router