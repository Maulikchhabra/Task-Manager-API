const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL, { //connecting to mongoose 
    useNewUrlParser: true, //depracated 
    useCreateIndex: true,
    useUnifiedTopology: true, //latestly used
    useFindAndModify: false
})

/*
const me = new User({ //creating a new user (in this case both name and age are compulsary.)
    name: 'Maulik',
    email: 'maulikchhabra@gmail.com',
    age: 19,
    password: 'maulik3780@',

})


me.save().then((me)=>{  //saving value on database and logging
   console.log(me);
   
}).catch((error)=>{
    console.log("Error!", error);
    
})

*/


/*
const task1 = new Task({ //creating a new Task
    description: 'Studying',
    completed: true
})


task1.save().then((task1)=>{  //saving value on database and logging
    console.log(task1);
    
}).catch((error)=>{
    console.log(error);
    
})
*/
