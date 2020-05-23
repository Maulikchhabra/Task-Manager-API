const jwt = require('jsonwebtoken');
const User = require('../models/users');

const auth = async (req,res,next)=>{
    //console.log('Authentication');
    try{
        const token = req.header('Authorization').replace('Bearer ',''); //getting the headers from the request of http and removing Bearer from it
        //console.log(token);
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        const user =await User.findOne({ _id: decode._id , 'tokens.token':token})

        if(!user){
            throw new Error() //will trigger the catch block below
        }

        req.token =token
        req.user =user
        next()
    }catch(e){
        res.status(401).send({Error: 'Please authenticate'});
    }

}

module.exports= auth