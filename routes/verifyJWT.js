const jwt = require('jsonwebtoken');

const verityToken = (req,res,next) =>{
    const authHeader = req.headers.token;
    if(authHeader){
        const token = authHeader.split(" ")[1];
        jwt.verify(token,process.env.JWT_SEC,(err,user) =>{
            if(err) res.status(401).json("Token invalid");
            req.user = user;
            next();
        })
    }else{
        res.status(401).json("You are not authorised");
    }
};

const verfiyTokenAuthorization = (req,res,next) => {
    verityToken(req,res,()=>{
        if(req.user.id === req.params.id || req.user.isAdmin){
            next()
        }else{
            res.status(401).json("your not allowed !")
        }
    })
}

module.exports = {verityToken,verfiyTokenAuthorization};