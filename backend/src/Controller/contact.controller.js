import { feedbackMail } from "../helper/feedbackMail.js"
import sendMail from "../helper/sendMail.js"
import { Contact } from "../models/contact.model.js"

export const contactUs = async (req, res) => {
    try {
        const { name, email, message } = req.body

        const requiredFields = [name, email, message]

        if (requiredFields.some((field) => !field.trim())) {
            return res.status(401).json({ message: "Please fill the all fields " })
        };

        const feedback = await Contact.create({
            name, email, message
        })
        sendMail(email, "Thanks for you feedback", "", feedbackMail(name))
        return res.status(200).json({ message: "Thank you for your response. We will check the response as soon as possible.", feedback })
    } catch (error) {
        return res.status(400).json({ message: "Getting error during sending response", error })
    }
}