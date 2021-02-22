module.exports = (authModel) => (req, res, next) => {
  const { username } = req.body;

  authModel.getUserBy("username", username).then((user) => {
    if (!user) {
      next();
    } else {
      res.status(405).json({ message: "username taken" });
    }
  });
};
