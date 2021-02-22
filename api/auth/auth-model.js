//* Import DB configuration
const db = require("../../data/dbConfig");

//* Function get user by
function getUserBy(property, value) {
  return db("users")
    .where({ [property]: value })
    .first();
}

//* Function to register a user
function registerUser(user) {
  return db("users")
    .insert(user)
    .then((id) => {
      return getUserBy("id", id);
    });
}

//* Export Modules

module.exports = {
  getUserBy,
  registerUser,
};
