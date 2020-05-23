const express = require('express');
const router = new express.Router();
const User = require('../models/users')
const auth = require('../middleware/auth');
const Task =require('../models/tasks');
const multer = require('multer');
const sharp =require('sharp');
const { sendWelcomeEmail, sendGoodByeEmail } =require('../emails/account')
//const { sendGoodByeEmail } =require('../emails/account')

router.post('/users', async (req,res)=>{ //setting the create user on localhost:3000/users (Resource creation)
    
    const user = new User(req.body);
    
    try{
        await user.save();
        sendWelcomeEmail(user.email, user.name) //sending email
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token});
    
    }catch(e){
        res.status(400).send(e);
    }
    
    /*
    user.save().then(()=>{
        res.status(201).send(user);
    }).catch((e)=>{
        res.status(400).send(e); //will set status code to 400 and send the error
       // res.send(e);  
    })
    */
})

router.post('/users/login' ,async (req,res)=>{ //will first run the middleware before the function execution
    try{
      const user = await User.findByCredentials(req.body.email, req.body.password)
      const token = await user.generateAuthToken()
      //res.send({ user: user.getPublicProfile(), token});
      res.send({user, token});
    }catch(e){
      res.status(400).send();
    }
})

router.post('/users/logout', auth,async (req,res)=>{ //will logout the user by deleting the token generated upon login
    try{
       req.user.tokens = req.user.tokens.filter((token)=>{
           return token.token !== req.token
       })

       await req.user.save()

       res.send()
    }catch(e){
       res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req,res)=>{
    try{
        req.user.tokens =[]
        await req.user.save()

        res.send()
    }
    catch(e){
        res.status(500).send()
    }
})

router.get('/users/me',auth,async (req,res)=>{ //setting reading the users (Resource reading)
    
    res.send(req.user)
    /*
    User.find({}).then((users)=>{ //passing empty object in find() will return all the users 
        res.send(users);
    }).catch((e)=>{
        res.status(500).send();
    })
    */
})


router.patch('/users/me',auth ,async (req,res)=>{ //setting update the user based on the id input from the http request (Resource updating)
    const updates = Object.keys(req.body);
    const allowedUpdates= ["name","email","password","age"];
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update));

    if(!isValidOperation){
        return res.status(400).send({Error: "Invalid updates"});
    }
    
    try{
        //const user = await User.findById(req.user._id);
        
        updates.forEach((update)=>{
            req.user[update] = req.body[update]
        })

        await req.user.save();

       //const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
       /*Here in findByIdAndUpdate, 1st argument is the value on the basis of which updation is performed, second argument is updated values and third argument is options to perform for the route  */

       res.send(req.user);
    }catch(e){
       res.status(400).send(e);
    }
})

router.delete('/users/me',auth ,async (req,res)=>{ //deleting the user
    try{
        /*
        const user = await User.findByIdAndDelete(req.user._id);

        if(!user){
            return res.status(404).send();
        }
       */

        await req.user.remove()
        sendGoodByeEmail(req.user.email, req.user.name) //sending email
        res.send(req.user);
    }catch(e){
        res.status(500).send();
    }
})

//File upload (profile pictures)
const upload = multer({
    limits:{
        fileSize: 1000000
    },

    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            cb(new Error('Please upload an image.'))
        }

        cb(undefined,true)
    }
})

router.post('/users/me/avatar',auth ,upload.single('avatar'),async (req,res)=>{ //router to get the profile picture 
    
    const buffer =await sharp(req.file.buffer).resize({ width: 250, height: 250}).png().toBuffer() //sharp will resize the image and convert image type to png and will again turn to buffer
  
    req.user.avatar =buffer //getting the buffer data in avatar
    await req.user.save()
    res.send()

}, (error,req,res,next)=>{ //fn handles the error caused by failing file upload
    res.status(400).send({Error: error.message})
})


router.delete('/users/me/avatar' ,auth, async (req,res)=>{
    req.user.avatar =undefined //clearing the avatar field
    await req.user.save()
    res.send()
})


router.get('/users/:id/avatar',  async (req,res)=>{ //fetching the profile pic of the user
    try{
       const user =await User.findById(req.params.id)

       if(!user || !user.avatar){
           throw new Error()
       }

       res.set('Content-Type','image/png') //setting response header
       res.send(user.avatar)
    }catch(e){
       res.status(404).send()
    }
})

module.exports =router