require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const http = require("https");
const request = require("request");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  var firstName = req.body.firstName;
  var secondName = req.body.secondName;
  var email = req.body.email;

  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: secondName,
        },
      },
    ],
  };

  var JSONdata = JSON.stringify(data);

  const url = "https://us21.api.mailchimp.com/3.0/lists/022a4439e5";

  const options = {
    method: "POST",
    auth: "Srajal:" + process.env.API_KEY,
  };

  const request = http.request(url, options, function (response) {
    if (response.statusCode === 200) res.sendFile(__dirname + "/success.html");
    else res.sendFile(__dirname + "/failure.html");

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(JSONdata);
  request.end();
  console.log(firstName, secondName, email);
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server is listening at port 3000");
});
