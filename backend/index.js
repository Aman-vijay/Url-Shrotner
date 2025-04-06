const express = require("express")
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const connectToMongoDb = require("./db")

const UrlRouter = require("./routes/url")
const userRouter = require("./routes/user")
const { redirectIdtoUrl } = require("./controllers/url");
const cors = require('cors')





const port = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));

connectToMongoDb();

app.get("/",(req,res)=>{
    res.send("Hello from the server side")
})
app.get("/:shortId", redirectIdtoUrl);


app.use("/api",UrlRouter)
app.use("/auth",userRouter)

app.listen(port ,()=>{
    console.log(`Server is running on port ${port}`);
})