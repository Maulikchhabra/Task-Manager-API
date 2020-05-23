const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({ //generating a model Task
    description:{
        type : String,
        trim: true,
        required: true
    },
    completed:{
        type: Boolean,
        default: false,
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId, //It is saying that type would be an objectID
        required: true,
        ref: 'User'
    }

}, {
    timestamps: true
})

//Tasks model
const Task = mongoose.model('Task',taskSchema)

module.exports =Task