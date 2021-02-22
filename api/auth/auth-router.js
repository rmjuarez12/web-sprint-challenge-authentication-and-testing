//* Setup Router
const router = require("express").Router();

//* Import modules
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//* Import secrets
const secrets = require("../config/secrets");

//* Import models
const authModel = require("./auth-model");

//* Import middleware
const validateData = require("../middleware/validateRegister");
const checkDuplicate = require("../middleware/checkDuplicate");

router.post(
  "/register",
  [validateData, checkDuplicate(authModel)],
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
        res.status(500).json({ message: "Error registering user", error: err });
      });
  }
);

router.post("/login", validateData, (req, res) => {
  const { username, password } = req.body;

  authModel
    .getUserBy("username", username)
    .then((user) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);

        res.status(200).json({ message: `welcome, ${user.username}`, token });
      } else {
        res.status(403).json({ message: "invalid credentials" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Error during login", error: err });
    });
});

//* Function to generate token
function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };

  const options = {
    expiresIn: "1h",
  };

  const secret = secrets.jwtSecret;

  return jwt.sign(payload, secret, options);
}

module.exports = router;
