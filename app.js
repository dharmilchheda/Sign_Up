//jshint esversion: 6
const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

// Server serves local images and local css using express function called static
app.use(express.static("public"));
// To get user input data from UI
app.use(bodyParser.urlencoded({extended: true}));

// user request server to get page
app.get("/", function(req, res){
  //console.log(__dirname);
  res.sendFile(__dirname +"/signup.html");

})

// server response to users request
app.post("/", function(req, res){
  const firstname = req.body.fname;
  const lastname = req.body.lname;
  var address = {
    "addr1" : req.body.addr1,
    "addr2" : req.body.addr2,
    "city" : req.body.City,
    "state": req.body.State,
    "zip": req.body.zip,
    "country": req.body.country
  };
  const phone = req.body.phone;
  const cgpa = req.body.CGPA;
  const college = req.body.COLLEGE;
  const email = req.body.email;
  console.log(firstname , lastname , address , phone , cgpa , college , email);

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstname,
          LNAME: lastname,
          ADDRESS: address,
          PHONE: phone,
          CGPA: cgpa,
          COLLEGE: college
        }
      }
    ]
  }
  // mailchimp wants data in string format
  const jsonData = JSON.stringify(data);
  const url = "https://us17.api.mailchimp.com/3.0/lists/03ce058235"
  const options = {
    method: "POST",
    auth: "signup:073b58a2350e0d9a1cc231ce1830e03e-us17"
  }

  // Get data from external resource - https.get(url, function(){ ... })
  // Post data to external resource - https.request(url, function(){ ... })
  const request = https.request(url, options, function(response){
    if(response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function(data){
      console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);
  request.end();
})

app.post("/failure", function(req, res){
  res.redirect("/");
})

// Server is up on 3000 so on chrome localhost:3000
app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000.");
})
