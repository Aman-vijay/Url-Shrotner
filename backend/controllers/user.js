const User = require("../models/user");
const { generateToken } = require("../utils/jwt");


const CreateUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username) {
            return res.status(401).json({ message: "Username missing" });
        }
        if (!email ) {
            return res.status(401).json({ message: "Email missing" });
        }
        if ( !password) {
            return res.status(401).json({ message: "Password missing" });
        }
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "User already exists, redirect to login" });
        }
        const passwordLength = password.length;
        if (passwordLength < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        const existingUsername = await  User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username already taken" });
        }
        
        const newUser = await User.create({ username, email, password });
        const { password: _, ...user } = newUser._doc;
        return res.status(201).json({
            message: "User created successfully",
            user,
            token: generateToken(user._id),
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ error: "Username or email already taken" });
        }
        res.status(500).json({ error: "Failed to create user", details: err.message });
    }
};


const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email ) {
            return res.status(401).json({ message: "Email missing" });
        }
        if ( !password) {
            return res.status(401).json({ message: "Password missing" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const { password: _, ...userData } = user._doc;
        return res.status(200).json({
            message: "Login successful",
            user: userData,
            token: generateToken(user._id),
        });
    } catch (err) {
        res.status(500).json({ error: "Failed to login", details: err.message });
    }
};

module.exports = {
    CreateUser,
    LoginUser,
};