const express = require('express');
require('./db/mongoosedb'); //importing mongoosedb.js so as server starts the file runs
const userRouter = require('./routers/user'); //importing userRouter file
const taskRouter = require('./routers/task'); //importing taskRouter in this file


const app =express();

const port = process.env.PORT;

/*
app.use((req,res,next)=>{ //middleware doing the extra work between new request and running route handler 
    //console.log(req.method, req.path);
    
    if(req.method ==='GET'){ //disabling GET request 
        res.send('GET request are disabled')
    }else{
        next()
    }
    
    //next() //without this the route handler will not gonna run 
})


app.use((req,res,next)=>{
    if(req.method ==='GET' || req.method ==='POST' || req.method==='DELETE' || req.method==='PATCH'){
        res.send('Maintenance')
    }
})
*/

/*
//file uploads (Multer)
const multer = require('multer')

const upload = multer({
    dest: 'images',
    limits:{
        fileSize: 1000000
    },

    fileFilter(req,file,cb){  //cb is callback
        if(!file.originalname.match(/\.(doc|docx)$/)){ //getting only PDF files and throwing errors on other file types
           return cb(new Error('Please upload a word document'))
        }

        cb(undefined,true)

         //cb(new Error('File must be a PDF')) sending an error for the file uploaded
        //cb(undefined, true)  accepting the file uploaded
        //cb(undefined, false)  rejecting the file uploaded

    }
})

app.post('/upload',upload.single('upload'),  (req,res)=>{ //upload.single() is a middleware for multer
    res.send()
}, 
  (error, req,res,next)=>{ //this function handles the error that occurs when file upload fails
       res.status(400).send({ Error: error.message})
  })
*/

app.use(express.json()) //will turn json into object so we can use it in response
app.use(userRouter);
app.use(taskRouter);


app.listen(port, ()=>{
    console.log("Server is up on port "+port);
    
})

/**EXPRESS MIDDLEWARES
 * 
 * Without middlewares: new request -> run route handler
 * 
 * With middlewares: new request -> do something -> run route handler 
 */

  