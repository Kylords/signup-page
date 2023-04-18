const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const port = process.env.PORT || 3001

const app = express();

app.use(express.static("public")); // Sinasabi mo na parang nandito tayo sa loob ng folder na to
app.use(bodyParser.urlencoded({extended: true}))


app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res) {
    const email = req.body.Email;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    // const apiKey = "34f49df16c29865e17a6f1a61488e644-us21";
    // const audienceID = "215d4f6b54" // if hindi gumana try this "215d4f6b54."

    const data = {
        members : [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data)
    
    const url = "https://us21.api.mailchimp.com/3.0/lists/215d4f6b54"
    const options = {
        method: "POST",
        auth: "kylo1:34f49df16c29865e17a6f1a61488e644-us21"
    }
    
    const request = https.request(url, options, function(response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        }

        else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function(data) {
            console.log(JSON.parse(data))
        })
    })

    request.write(jsonData);
    request.end();
    

});

app.post("/failure", function(req, res) {
    res.redirect("/");
})

app.listen(port, function() {
    console.log("Server is running on port 3000.");
    
})