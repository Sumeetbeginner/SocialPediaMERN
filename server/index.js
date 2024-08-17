
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