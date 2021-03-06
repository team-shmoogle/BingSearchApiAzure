const express = require("express");
const router = express.Router();
const fs = require("fs");
const axios = require("axios");
const SENDGRID_BEARER = process.env.APPSETTING_SENDGRID_BEARER;
const SENDGRID_LIST_ID = process.env.APPSETTING_SENDGRID_LIST_ID;
/* {
    "id": ******,
    "name": "shmoogleUsers",
    "recipient_count": 0
} */

/* post  add new user to local json file and to sendgrid API*/
router.post("/", function(req, res) {
  let email = req.body.email;
  let headers = {
    Authorization: "Bearer " + SENDGRID_BEARER,
    "Content-Type": "application/x-www-form-urlencoded"
  };
  let newUserQuery = [
    {
      email: req.body.email
    }
  ];

  let listId = SENDGRID_LIST_ID;

  /* Create New User sendGris */
  axios
    .post("https://api.sendgrid.com/v3/contactdb/recipients", newUserQuery, {
      headers: headers
    })
    .then(response => {
      console.log(response.data.persisted_recipients);
      axios
        .post(
          `https://api.sendgrid.com/v3/contactdb/lists/${listId}/recipients/` +
            response.data.persisted_recipients[0],
          "",
          {
            headers: headers
          }
        )
        .then(response => {
          fs.readFile("./sendGrid/users.json", (err, data) => {
            var json = JSON.parse(data);
            console.log(json);
            json.emails.push({ email: email });
            console.log(json);
            fs.writeFile(
              "./sendGrid/users.json",
              JSON.stringify(json, null, 4),
              "utf8",
              err => {
                console.log(err);
              }
            );
          });
          res.json({ status: "ok" });
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
