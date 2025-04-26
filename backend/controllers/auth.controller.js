const bcrypt = require('bcryptjs')
const User = require('../models/user.model')
const generateToken = require('../config/generateToken')

const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'please fill all the fields' })
        }
        if (await User.findOne({ email })) {
            return res.status(400).json({ message: 'email already exists' })
        }
        else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const newUser = await User.create({ name, email, password: hashedPassword });

            if (newUser) {
                const token = await generateToken(newUser._id, res)
                return res.status(201).json({ message: 'user succesfully created', user: newUser, jwt: token })
            } else {
                return res.status(400).json({ message: 'something went wrong' })
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'internal server error' })
    }
}
const logIn = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: "please fill all  the required fields" })
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "email does not exists" })
        }
        if (await bcrypt.compare(password, user.password)) {
            const token = generateToken(user._id, res);
            return res.status(200).json({ message: "logged in successfully", token, user })
        }
        else {
            return res.status(400).json({ message: "password does not  match" })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'internal server error' })
    }
}
const logOut = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        return res.status(200).json({ message: "logged out succesfully" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'internal server error' })
    }
}

module.exports = {
    logIn,
    logOut,
    signUp,
}
