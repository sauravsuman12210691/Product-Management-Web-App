const jwt = require('jsonwebtoken');
const jwt_SECRT = process.env.Secrate;
const getuser=(req,res,next)=>{
    const token=req.header('auth-token')
    // console.log(token)
    if(!token){
        res.status(401).send({error:"Please authenticate using a valid token"})

    }
  
    const data =jwt.verify(token,jwt_SECRT);
    // console.log(data)
    req.user=data.user;
    next();
   
}
module.exports=getuser;