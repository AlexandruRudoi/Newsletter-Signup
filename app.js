const express = require("express");
const request = require("request");
const app = express();
const https = require("https");
const mailchimp = require('@mailchimp/mailchimp_marketing');

//Alternative for body-parser
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//static folder for using local css, images etc.
app.use(express.static("public"));


//Sending the signup.html file to the browser as soon as a request is made on localhost:3000
app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});


//Setting up MailChimp
mailchimp.setConfig({
    //*****************************ENTER YOUR API KEY HERE******************************
    apiKey: "5c20987cebf9121d9292044627e882cd-us5",
    //*****************************ENTER YOUR API KEY PREFIX HERE i.e.THE SERVER******************************
    server: "us5"
});

//As soon as the sign in button is pressed execute this
app.post("/", function (req,res) {
    //*****************************CHANGE THIS ACCORDING TO THE VALUES YOU HAVE ENTERED IN THE INPUT ATTRIBUTE IN HTML******************************
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    //*****************************ENTER YOU LIST ID HERE******************************
    const listId = "76675adafd";
    //Creating an object with the users data
    const subscribingUser = {
        firstName: firstName,
        lastName: lastName,
        email: email
    };

    //Uploading the data to the server
    async function run() {
        const response = await mailchimp.lists.addListMember(listId, {
            email_address: subscribingUser.email,
            status: "subscribed",
            merge_fields: {
                FNAME: subscribingUser.firstName,
                LNAME: subscribingUser.lastName
            }
        });
        //If all goes well logging the contact's id
        res.sendFile(__dirname + "/success.html")
        console.log(`Successfully added contact as an audience member. The contact's id is ${response.id}.`);
    }
    //Running the function and catching the errors (if any)
    // ************************THIS IS THE CODE THAT NEEDS TO BE ADDED FOR THE NEXT LESSON*************************
    // So the catch statement is executed when there is an error so if anything goes wrong the code in the catch code is executed. In the catch block we're sending back the failure page. This means if anything goes wrong send the faliure page
    run().catch(e => res.sendFile(__dirname + "/failure.html"));
});


app.post("/failure", (req, res)=>{
    res.redirect('/');
});

//Listening on port X and if it goes well then logging a message saying that the server is running
const port = 3000;
app.listen(process.env.PORT || port, ()=>{
    console.log(`Server is running on port ${port}.`);
});