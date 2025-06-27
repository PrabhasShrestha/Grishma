const User = require("../model/usermodel");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const createUsers = async (req, res) => {
    console.log(req.body);
    console.log(req.files?.length ? req.files[0].path : null);
    try {
        const { username, email, password } = req.body;
        if (!username || !password || !email) {
            return res.json({ success: false, message: "please fill all fields" });
        }
        const image = req.files?.length ? req.files[0].path : null;

        const UserExist = await User.findOne({ where: { username } });
        if (UserExist) {
            return res.status(409).json({ success: false, message: "user already exists" });
        }

        const EmailExist = await User.findOne({ where: { email } });
        if (EmailExist) {
            return res.status(409).json({ success: false, message: "email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({ username, email, password: hashedPassword, image });
        return res.status(201).json({ success: true, message: "user created", user: { id: newUser.id, username, email, image } });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const updateUsers = async (req, res) => {
    const userId = req.params.id;
    try {
        const UserExist = await User.findByPk(userId);
        if (UserExist) {
            console.log("user exist");
            const { username, email, password, image } = req.body;
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = password ? await bcrypt.hash(password, salt) : UserExist.password;
            const updatedUser = await User.update(
                { username, email, password: hashedPassword, image },
                { where: { id: userId }, returning: true, plain: true }
            );
            res.status(200).json({ success: true, message: "user updated", user: updatedUser[1] });
        } else {
            res.json({ success: false, message: "user doesnt exist" });
        }
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const getUsers = async (req, res) => {
    const userId = req.params.id;
    try {
        const UserExist = await User.findOne({ where: { id: userId } });
        if (UserExist) {
            res.json({ success: true, user: UserExist });
        } else {
            res.json({ success: false, message: "user doesnt exist" });
        }
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const deleteUsers = async (req, res) => {
    console.log(req.params.id);
    const userId = req.params.id;
    try {
        const UserExist = await User.findByPk(userId);
        if (UserExist) {
            await User.destroy({ where: { id: userId } });
            res.status(200).json({ success: true, message: "user deleted" });
        } else {
            res.json({ success: false, message: "user not found" });
        }
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const getAllUsers = async (req, res) => {
    console.log(req.headers.authorization);
    try {
        const users = await User.findAll({ attributes: { exclude: ["password"] } });
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: "error fetching users" });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ success: false, message: "user not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_TOKEN,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                image: user.image
            }
        });

        console.log(`User logged in: ${user.username} (ID: ${user.id}, Email: ${user.email}) at ${new Date().toISOString()}`);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = {
    createUsers,
    updateUsers,
    deleteUsers,
    getAllUsers,
    getUsers,
    loginUser
};