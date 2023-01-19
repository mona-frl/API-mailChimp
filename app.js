require("dotenv").config()
//Express
const express = require('express');
const app = express();
const port = 3000

//https
const https = require('https');
//static 
app.use(express.static(__dirname));
//body
app.use(express.urlencoded({ extended: true }))



//root get
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html')
})

//starting mailchimp
const mailchimp = require("@mailchimp/mailchimp_marketing");

mailchimp.setConfig({
    apiKey: process.env.API_KEY,
    server: process.env.SERVER
});


//post
app.post('/', (req, res) => {
    //fetchs the info from the html input
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    //list ID for the mailchimp
    const listId = process.env.LISTID

    // sends the info to the mailchimp
    async function run() {
        try {
            const response = await mailchimp.lists.addListMember(listId, {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            });
            console.log(`This user's subscription status is ${response.status}.`);
            res.sendFile(__dirname + '/success.html')
        } catch (err) {
            console.log(err.status);
            res.sendFile(__dirname + "/failure.html");
        }
    }
    run();
})

app.post("/failure", function (req, res) {
    res.redirect("/");
});








//Listening to the port 4200
app.listen(process.env.PORT || port, () => {
    console.log(`Listening to the port ${port}`);
})






