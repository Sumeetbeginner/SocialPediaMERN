
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// REGISTER USER
export const register  = async (req, res) =>{
    try{

        // Destructuring input data in body
        const{
            firstName, 
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body 

        // Check if a user with the same email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        } 

        // Salt is a random string generated for all password to hash  
        const salt = await bcrypt.genSalt()
        const passwordHash = await bcrypt.hash(password, salt)

        const newUser = new User({
            firstName, 
            lastName,
            email,
            password : passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile:0,
            impressions:0,
        })

        // Save User data in MongoDB
        const savedUser = await newUser.save()
        res.status(201).json(savedUser)
    }
    catch(err){
        res.status(500).json({error : err.message})
    }
}

// LOGIN
export const login = async (req, res) => {
    try{

        const {
            email,
            password
        } = req.body

        // Check if email already exists in database
        const user = await User.findOne({email:email})

        if(!user){
            return res.status(400).json({mess : "user doesnt exist!"})
        }

        // Comparing password with hashed password
        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch) return res.status(400).json({mess: "Incorrect Password!"})

        // JSON WEB TOKEN SETUP
        const token = jwt.sign({id : user._id}, process.env.JWT_SECRET)
        delete user.password

        res.status(200).json({token, user})

    }
    catch(err){
        res.status(500).json({error : err.message})
    }
}