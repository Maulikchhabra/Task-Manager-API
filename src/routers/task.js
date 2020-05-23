const express = require('express')
const router = new express.Router();
const Task = require('../models/tasks')
const auth = require('../middleware/auth')

router.post('/tasks', auth,async (req,res)=>{ //setting create task (Resource creation)

    const task = new Task({
        ...req.body,
        owner: req.user._id //including the user who made the task in the task made
    });
    //console.log(req.body.description); Checking if we can call object variables like this
    try{
       await task.save();
       res.status(201).send(task);
    }catch(e){
       res.status(400).send(e);
    }

    /* 
    task.save().then(()=>{
        res.status(201).send(task);
    }).catch((e)=>{
        res.status(400).send(e); 
    })
    */
})

//GET /tasks or (GET /tasks?completed=true)
/**
 * Limit And Skip:
 * 
 * GET /tasks?limit=10&skip=0 getting the first page containing 10 tasks
 * 
 * As skip value increases the page increases like skip=10 be page no 2 as it skips 1st 10 tasks
 */
//GET /tasks?sortBy=createdAt:asc in case of ascending orders and :desc in case of descending orders
router.get('/tasks', auth,async (req,res)=>{ //setting reading tasks (Resource reading)

    const match ={}
    const sort={}
    if(req.query.completed){
        match.completed =req.query.completed === 'true' //checking if req.query.completed is 'true' or 'false and setting the boolean acc to it'
    }

    if(req.query.sortBy){
        const parts =req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try{

        await req.user.populate({
            path: 'tasks',
            match,
            options:{
                limit: parseInt(req.query.limit), //will get limit as {{url}}/tasks?limit=2 and will return all if no limit is defined
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
        
        /**
         * Other method is:
         * const tasks =await Task.find({owner: req.user._id}); only getting the tasks created by the logged in user
         * res.send(tasks);
         */

        
    }catch(e){
        res.status(500).send(e);
    }

    /*
    Task.find({}).then((tasks)=>{
        res.send(tasks);
    }).catch((e)=>{
        res.status(500).send();
    })
    */
})

router.get('/tasks/:id',auth ,async (req,res)=>{ //setting reading single task (Resource reading)

    const _id = req.params.id;

    try{
       //const task = await Task.findById(_id);

       const task = await Task.findOne({ _id, owner: req.user._id}) //getting the task with the id and of the user mentioned
       if(!task){
           return res.status(404).send();
       }

       res.send(task);
    }catch(e){
       res.status(500).send(e);
    }

    /*
    Task.findById(_id).then((task)=>{
        if(!task){          
            res.status(404).send();  //setting error if no task with given id is found
        }

        res.send(task);
    }).catch((e)=>{
        res.status(500).send();
    })
    */
})

router.patch('/tasks/:id',auth ,async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, owner:req.user._id})

        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true}

        if (!task) {
            return res.status(404).send()
        }

        updates.forEach((update)=>task[update] =req.body[update])

        await task.save()

        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', auth,async (req,res)=>{
    try{
        const task = await Task.findOneAndDelete({_id:req.params.id , owner:req.user._id});

        if(!task){
            return res.status(404).send();
        }

        res.send(task);
    }catch(e){
        res.status(500).send();
    }
})

module.exports =router