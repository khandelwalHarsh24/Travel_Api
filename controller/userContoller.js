const bcrypt=require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require('../DB/connectDb');
const queries=require('../queries/userquery')


const validatePassword = (password) => {
    const minLength = 8;
    const hasAlphabet = /[a-zA-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
    return password.length > minLength && hasAlphabet && hasSpecialChar;
};

const getUserData=async(req,res)=>{
    const userData=await pool.query(queries.getUser);
    res.status(200).json(userData.rows);
}

const userRegister=async(req,res)=>{
     try{
        const {username,password,role}=req.body;
        if (!validatePassword(password)) {
            return res.status(400).send({ message: 'Password must be greater than 8 characters, contain at least one alphabet, and one special character' });
        }
        const userExists = await pool.query(queries.getSingleUser, [username]);
        if (userExists.rows.length > 0) {
            return res.status(400).send({ error: 'Username already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            queries.userRegister,
            [username, hashedPassword, role]
        );
        const newUser = result.rows[0];
        res.status(201).send({ message: 'User registered successfully'});
     }
     catch(err){
        return res.status(500).send(err);
     }
}

const loginUser=async(req,res)=>{
    const {username,password}=req.body;
    try {
        const result = await pool.query(queries.getSingleUser,[username]);;
        const jwt_secret=process.env.jwt_secret
        // console.log(user);
        const user=result.rows[0];
        if (!user) return res.status(400).send({ message: 'Invalid credentials' });
    
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send({ message: 'Invalid credentials' });
    
        const token = jwt.sign({ id: user.id,role: user.role }, jwt_secret, { expiresIn: '1h' });
        // console.log(token);
        res.status(200).send({token});
      } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
}


module.exports={getUserData,userRegister,loginUser};