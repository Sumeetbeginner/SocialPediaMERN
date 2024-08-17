
import express from 'express'
import bodyParser from 'body-parser' //middleware that parses incoming request bodies in JSON or URL-encoded format 
import mongoose from 'mongoose'
import cors from "cors"
import dotenv from 'dotenv'
import multer from 'multer' //Upload files

import helmet from 'helmet' //helps secure Express/Node.js applications by setting various HTTP headers to protect against common web         vulnerabilities like cross-site scripting (XSS) and clickjacking.

import morgan from 'morgan' //useful for monitoring and debugging request details in development and production

import path from "path"
import { fileURLToPath } from 'url'

// Importing Routes
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import postRoutes from './routes/posts.js'
import {register} from './controllers/auth.js'
import {createPost} from './controllers/posts.js'

import { verifyToken } from './middleware/auth.js'

// Manually Inject some data in database
import User from './models/User.js'
import Post from './models/Post.js'
import { users, posts } from './data/index.js'

// CONFIGURATIONS
const __filename = fileURLToPath(import.meta.url) //Grab File URL - Only Works on type module
const __dirname = path.dirname(__filename)

dotenv.config()

const app = express()
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}))  //Any origin can acces resource from my server
app.use(morgan("common"))

app.use(bodyParser.json({limit : "30mb", extended:true}))
app.use(bodyParser.urlencoded({limit : "30mb", extended:true}))

app.use(cors())

app.use('/assets', express.static(path.join(__dirname, 'public/assets')))  //To store images locally, In real use Storage Cloud

// FILE STORAGE
const storage = multer.diskStorage({
    destination:function(req, file, cb){
        cb(null, 'public/assets')
    },
    filename:function(req, file, cb){
        cb(null, file.originalname)
    }
})

const upload = multer({storage})

// ROUTES WITH FILES
app.post('/auth/register', upload.single('picture'), register)
app.post('/posts', verifyToken, upload.single('picture'), createPost)

// ROUTES
app.use("/auth", authRoutes)
app.use("/user", userRoutes)
app.use("/post", postRoutes)

// MONGOOSE SETUP
const PORT = process.env.PORT || 6001

mongoose.connect(process.env.MONGO_URL)
.then(() =>{
    app.listen(PORT, () => console.log(`SERVER Port : ${PORT}`))

    //! ADD DATA ONLY ONE TIME
    // User.insertMany(users)
    // Post.insertMany(posts)
    
})
.catch((error) =>{
    console.log(error);
    
})