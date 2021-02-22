module.exports = (req, res, next) => {
  const { username, password } = req.body;

  if (!username || username === "" || !password || password === "") {
    res.status(400).json({ message: "username and password required" });
  } else {
    next();
  }
};
