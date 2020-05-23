const sgMail =require('@sendgrid/mail') //importing the package

const sendgridAPIKey =process.env.SENDGRID_API_KEY
//API key generated at website of sendgrid

sgMail.setApiKey(sendgridAPIKey) //setting the API key for sendgrid

/*
sgMail.send({
    to: 'maulikchhabra@gmail.com',
    from: 'maulikchhabra@gmail.com',
    subject: 'LOL',
    text: 'I hope this one get to you.'

}).then(()=>{
    console.log("it worked");
    //res.send()
}).catch((error)=>{
    console.log(error.response.body)
    
}) //contents of the mail to be sent 
*/

const sendWelcomeEmail =(email, name)=>{  //fn to mail the new user 
    sgMail.send({
        to: email,
        from: 'maulikchhabra@gmail.com',
        subject: 'Thanks for joining in!',
        text:  `Welcome to the app, ${name}. Let me know how you get along with the app` //ES6
    }).then(()=>{
        console.log("Welcome!");
        
    }).catch((error)=>{
        console.log(error.response.body);
        
    })
}

const sendGoodByeEmail =(email, name)=>{
    sgMail.send({
        to: email,
        from: 'maulikchhabra@gmail.com',
        subject: 'Account deletion',
        text:  `Good Bye, ${name}. Kindly let us know what made you disabling your subcriptions`
    
    }).then(()=>{
        console.log("Good Bye!");
        
    }).catch((error)=>{
        console.log(error.response.body);
        
    })
}

module.exports={
    sendWelcomeEmail, sendGoodByeEmail
}