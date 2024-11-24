import express from 'express'
import dbConnection from "./db/main.db.js";
import cookieParser from 'cookie-parser';
import cors from 'cors'
import userRouter from './routes/user.routes.js'
const app = express();

app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["POST", "GET", "PUT", "DELETE"]
}))

//Routes
app.use("/api/v1/user",userRouter)

const port = process.env.PORT || 8080;

dbConnection().then(
    app.listen(port , () => {
        console.log(`Server is now available on port : ${port}`)
    })
).catch((error)=>{
    console.log("getting Error while switching on the server.")
})