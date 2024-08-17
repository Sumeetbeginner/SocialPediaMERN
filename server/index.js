
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