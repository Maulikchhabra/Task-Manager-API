const mongoose = require('mongoose');
const validator = require('validator');
const becrypt = require('bcryptjs'); //importing becrypt for password authentication and protection
const jwt = require('jsonwebtoken');
const Task = require('../models/tasks')

const userSchema =new mongoose.Schema({  //generating a model User
    name: {
        type: String,
        default: 'anonymous',
        required: true,
        trim: true //will remove unneccessary spaces
    }, 
    email:{
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique:true,

        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid!')
            }
        }
    },
    age:{
        type: Number,
        default: 0,

        validate(value){ //will perform validations on the value of age and act accordingly
            if(value < 0){
                throw new Error('Age must be a positive number!')
            }
        }
    },
    password:{
        type: String,
        required: true,
        trim: true,
        minlength:7,

        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password cannot contain the word password!')
            }
        }
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }],
    avatar:{ //for profile pics
        type: Buffer
    }

}, {
    timestamps: true //will show createdAt and updatedAt times
})

userSchema.virtual('tasks',{
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.generateAuthToken =async function() {
    const user =this;

    const token =jwt.sign({ _id: user._id.toString()}, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    await user.save()
    
    return token
}

userSchema.methods.toJSON = function(){  //removing the user's data like password and tokens from the response (overrided toJSON)
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

userSchema.statics.findByCredentials = async (email,password)=>{
    const user =await User.findOne({ email })

    if(!user){
        throw new Error("Unable to log in");
    }

    const isMatch = await becrypt.compare(password, user.password);

    if(!isMatch){
        throw new Error("Unable to log in");
    }

    return user
}


//Hash the plain text passowrd (Its a middleware)
userSchema.pre('save',async function (next){ //cant use arrow fn here, use normal functions
   const user =this

   if(user.isModified('password')){
      user.password = await becrypt.hash(user.password, 8);
   }

   next() //will call the function after the code above it gets completed (in our case when a user gets created)
})

//Delete user tasks when user is removed
userSchema.pre('remove', async function (next){
    const user =this
    await Task.deleteMany({ owner: user._id})
    
    next()
})

//User model
const User = mongoose.model('User',userSchema);

module.exports =User