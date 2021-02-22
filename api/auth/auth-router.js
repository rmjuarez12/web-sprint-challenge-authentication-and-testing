//* Setup Router
const router = require("express").Router();

//* Import bcrypt
const bcrypt = require("bcryptjs");

//* Import models
const authModel = require("./auth-model");

//* Import middleware
const validateRegister = require("../middleware/validateRegister");
const checkDuplicate = require("../middleware/checkDuplicate");

router.post(
  "/register",
  [validateRegister, checkDuplicate(authModel)],
  (req, res) => {
    const user = req.body;

    // Hash the password
    const hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;

    authModel
      .registerUser(user)
      .then((user) => {
        res.status(201).json(user);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  }
);

router.post("/login", (req, res) => {
  res.end("implement login, please!");
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
});

module.exports = router;
