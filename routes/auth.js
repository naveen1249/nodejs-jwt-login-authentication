const User = require('../models/User');
const router = require('express').Router();
const CryptoJs = require('crypto-js')
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const {verfiyTokenAuthorization} = require('./verifyJWT')

// Register

router.post('/register', async (req,res) =>{
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJs.AES.encrypt(req.body.password,process.env.ENC)
    });
    try {
        const saveUser = await newUser.save();
        res.json(saveUser);
    } catch (error) {
        res.status(500).json(error);
    }
    
});

// Login

router.post('/login', async (req,res) => {

    console.log("heelo")
    try {
        const user = await User.findOne({ username: req.body.username});
        !user && res.status(401).json("wrong credentials");

        const hashPassword = CryptoJs.AES.decrypt(
            user.password,
            process.env.ENC
        );
        const Originalpassword = hashPassword.toString(CryptoJs.enc.Utf8);

        Originalpassword !== req.body.password &&
        res.status(401).json("wrong credentials");

        const accessToken = jwt.sign({
            id:user._id,
            isAdmin:user.isAdmin
        },
        process.env.JWT_SEC,
        {expiresIn: "3d"}

        );

        const {password, ...others}=user._doc;

        res.status(200).json({...others,accessToken});


    } catch (error) {
        res.status(500).json(error);
    }
    
    
});


router.put("/:id",verfiyTokenAuthorization,async (req,res)=>{
    if(req.body.password){
        req.body.password = CryptoJs.AES.encrypt(req.body.password,process.env.ENC).toString();
    }

    try {
        const updateUser = await User.findByIdAndUpdate(req.params.id,{
            $set: req.body
        },{new:true});
        res.status(200).json(updateUser)
    } catch (error) {
        res.status(500).json(error)
    }
})


module.exports = router;
