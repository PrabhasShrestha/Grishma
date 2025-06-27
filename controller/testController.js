const User = require("../model/usermodel")
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const createUsers = async (req,res) => {
    console.log(req.body)
    console.log(req.files?.length? req.files[0].path : null)
    try {
        const { username, email, password } = req.body;
        if(!username || !password || !email){
            return res.json({sucess:false, message:"please fill all fields"});
        }
        //const image = req.files?.length? req.files[0].path : null;

        const UserExist = await User.findOne({ where:{username:username} });
        if (UserExist){
        return res.status(201).json({sucess:false, message:"user already exists "});
        }

        const EmailExist = await User.findOne({ where:{email:email} });
        if (EmailExist){
        return res.status(201).json({sucess:false, message:"email already exists "});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({ username, password: hashedPassword, email })
        return res.status(200).json({ success: true, message: "user created",newUser});

    } catch (error) {
        res.status(400).json({ error: error });
    }
};

const updateUsers = async (req,res) => {
    const userId = req.params.id;
    try{
        const UserExist = await User.findByPk(userId);
        if(UserExist){
            console.log("user exist")
            

            const{username,email,password} = req.body;
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
    
            const updateduser = await User.update({username:username, password:hashedPassword, email},
                {where: {id:userId}, returning:true});
            res.status(201).json({sucess:true,message:"user updated"}, updateduser);
        }
        else{
            res.json({message:"user doesnt exist"})
        }
    }
    catch(error){
        res.status(400).json({error:error});
    }
};


const getUsers = async (req,res) => {
    const userId = req.params.id;
    try{
        const UserExist = await User.findOne({where:{id: userId}});
        if(UserExist){
            res.json("user exist")
        }
        else{
            res.json({message:"user doesnt exist"})
        }
    }
    catch(error){
        res.status(400).json({error:error});
    }
};

const deleteUsers = async (req,res) => {
    console.log(req.params.id)
    const userId = req.params.id;
    try{
        const UserExist = await User.findByPk(userId);
        if(UserExist){
            const deleteUsers = await User.destroy(
                {where: {id:userId}});
            res.status(201).json({sucess:true,message:"user deleted"}, deleteusers);
        }
        else{
            res.json({sucess: false, message:"user not found"})
        }
    }
    catch(error){
        res.status(400).json({error:error});
    };
};


const getAllUsers = async (req, res) =>{
    console.log(req.headers.authorization)
    try {
        const users = await User.findAll({attributes:{exclude:["email","password"]}});
        res.json({sucess:true, users: users});
    } catch (error) {
        res.status(500).json ({error: "error fetching users"});
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email: email } });
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
                email: user.email
            }
        });

        // Log successful login
        console.log(`User logged in: ${user.username} (ID: ${user.id}, Email: ${user.email}) at ${new Date().toISOString()}`);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// testController.js
// testController.js
const authenticateToken = (req, res, next) => {
    // Example authentication logic
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }
    // Add your token verification logic here
    next(); // Proceed to the next middleware or route handler
};

// Example route handler functions
const someFunction = (req, res) => {
    res.json({ success: true, message: 'Test POST endpoint' });
};

const anotherFunction = (req, res) => {
    res.json({ success: true, message: 'Test GET endpoint' });
};

module.exports = {
    createUsers,
    updateUsers,
    deleteUsers,
    getAllUsers,
    getUsers,
    loginUser,
    authenticateToken,
    someFunction,
    anotherFunction
};