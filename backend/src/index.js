import express from 'express'
import dbConnection from "./db/main.db.js";
import cookieParser from 'cookie-parser';
import cors from 'cors'
import userRouter from './routes/user.routes.js'
import contactRouter from './routes/contact.routes.js'
import aiSuggestionRoute from './routes/aiSuggestion.route.js'

const app = express();

app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin: ["http://localhost:3000", "http://192.168.1.48:3000"],
    credentials: true,
    methods: ["POST", "GET", "PUT", "DELETE"]
}))

//Routes
app.use("/api/v1/user", userRouter)
app.use("/api/v1/contact", contactRouter)
app.use("/api/v1/ai",aiSuggestionRoute)


const port = process.env.PORT || 8080;

dbConnection().then(
    app.listen(port, () => {
        console.log(`Server is now available on port : ${port}`)
    })
).catch((error) => {
    console.log("getting Error while switching on the server.", error)
})