//CRUD (create read update delete)

/*
const mongodb = require('mongodb'); //importing mongoDB npm package
const MongoClient = mongodb.MongoClient; //getting mondoDB client
const ObjectID = mongodb.ObjectID;
*/

const { MongoClient, ObjectID} =require('mongodb');  //destructure above properties

const connectionURL ='mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

//const id = new ObjectID(); //getting id for the documents
//console.log(id);
//console.log(id.getTimestamp());  getting all about id 

MongoClient.connect( connectionURL, { useUnifiedTopology: true} ,(error, client)=>{

    if(error){
        return console.log("Unable to connect to database!");
    }

    //console.log("Connected correctly!!");    Debugging
    
    const db = client.db(databaseName);
    
    //INSERT METHODS 

   /*
    db.collection('users').insertOne({ //inserting one document in the database collection
        _id: id,
        name: 'Aiden',
        age: 19
    }, (error, result) =>{

        if(error){
            return console.log("Unable to insert user");
        }

        console.log(result.ops); //printing an array of documents inserted
    })

    
    db.collection('users').insertMany([ //inserting many documents in the database collection
        {
            name: 'Harivansh',
            age: 19
        }, 
        {
            name:'Hridyanshu',
            age: 20
        }
   ], (error,result) =>{

       if(error){
           return console.log("Unable to insert documents");
           
       }

       console.log(result.ops); //printing array of documents
       
   })
   

   //Challenge start
   db.collection('tasks').insertMany([
       {
           description: 'Sleeping',
           completed : true
       },
       {
           description: 'Eating',
           completed: true
       },
       {
           description: 'Studying',
           completed: false
       }
   ], (error,result) =>{
        if(error){
            return console.log("Unable to insert documents");
        }

        console.log(result.ops); //printing array of documents
        
   })
   //Challenge completed
   

   //FETCH (READ) METHODS

   db.collection('users').findOne({ name : 'Aiden'}, (error,user)=>{ //findOne function will find out and return the document bases on the object field the searching is done

       if(error){
           console.log("Unable to fetch data!");
       }

       console.log(user);
   })


   db.collection('users').findOne({ name : 'Aiden' , age: 12}, (error,user)=>{ //findOne function is returning null as there is no entry of document with following fields.
        if(error){
           console.log("Unable to fetch data!");
       }

        console.log(user);
   })


   db.collection('users').findOne( { _id: new ObjectID("5eb29078f8d0de6f78b5dbb6") }, (error,user)=>{ //findOne function is fetching the document thru the object id of the document
       if(error){
          console.log("Unable to fetch data!");
       }

       console.log(user);
    })


    db.collection('users').find( {age: 19} ).toArray((error,users) =>{ //getting all the document entries in an array having age =19
        console.log(users);
        
    })


    db.collection('users').find( {age: 19} ).count((error,count) =>{ //getting the count of all the documents having age =19
        console.log(count);
        
    })
    

    db.collection('tasks').findOne( {_id: new ObjectID("5eaff47d70087a3654e68301") }, (error, task)=>{

        if(error){
            console.log("Unable to fetch data");
        }

        console.log(task);
    })


    db.collection('tasks').find( {completed : false}).toArray( (error, tasks) =>{

        if(error){
            console.log("Unable to fetch data");
        }

        console.log(tasks);
    })

    //UPDATE METHODS

    db.collection('users').updateOne( {_id: new ObjectID("5eaff07ddb5f4268289260bd") 
      }, { 
          $set: { //set method to set the old value to  a new one
                name : 'Mike'
         }
     }).then((result)=>{  //used promises for the update method instead of callback
        console.log(result);
        
    }).catch((error)=>{
        console.log(error);
        
    }) 

    
    db.collection('users').updateOne( {_id: new ObjectID("5eaff07ddb5f4268289260bd") 
      }, { 
          $inc: { //inc method to increment the old value by the number given
                age : 1
         }
     }).then((result)=>{  //used promises for the update method instead of callback
        console.log(result);
        
    }).catch((error)=>{
        console.log(error);
        
    })


    db.collection('tasks').updateMany({ completed :false
    },{
        $set:{
            completed: true
        }
    }).then((result)=>{
        console.log(result.modifiedCount);
        
    }).catch((error)=>{
        console.log(error);
        
    })
    */
     
    //DELETE METHOD

    //remove method is depracated,use deleteOne and deleteMany

    db.collection('users').deleteMany({ //deleteMany method to delete more than one document based on the search
        age:20
    }).then((result)=>{
        console.log(result);
        
    }).catch((error)=>{
        console.log(error);
        
    })


    db.collection('tasks').deleteOne( { //deleteOne to delete single document from database based on search
        description :'Studying'
    }).then((result)=>{
        console.log(result);
        
    }).catch((error)=>{
        console.log(error);
        
    })

})