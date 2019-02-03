require("dotenv").load();
const express = require("express");
const router = express.Router();
const fs = require("fs");
const axios = require("axios");
const request = require("request");
/* {
    "id": 6862421,
    "name": "shmoogleUsers",
    "recipient_count": 0
} */

/* post  add new user to local json file and to sendgrid API*/
router.post("/", function(req, res) {
  console.log(req.body);
  /*   fs.appendFile("./sendGrid/users.json", req.body.email + "\n", err => {
    console.log(err);
  });
  fs.close(err => {
    console.log(err);
  }); */

  let headers = {
    Authorization:
      "Bearer ***REMOVED***",
    "Content-Type": "application/x-www-form-urlencoded"
  };
  let newUserQuery = [
    {
      email: req.body.email
    }
  ];
  /* Create New User sendGris */

  axios
    .post("https://api.sendgrid.com/v3/contactdb/recipients", newUserQuery, {
      headers: headers
    })

    .then(response => {
      console.log(response.data.persisted_recipients[0]);
      axios.get(
        "https://api.sendgrid.com/v3/contactdb/recipients/" +
          response.data.persisted_recipients[0],
        {
          headers: headers
        }
      );
    })
    .then(response => {
      //console.log(response);
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
