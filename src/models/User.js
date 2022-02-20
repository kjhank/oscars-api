const { query } = require('../db');

function User({
  username,
  email,
  password,
}) {
  this.username = username;
  this.email = email;
  this.password = password;
}

User.prototype.createUser = async function () {
  try {
    const { rows } = await query('INSERT INTO users(username, email, password) VALUES ($1, $2, $3)', [
      this.username,
      this.email,
      this.password,
    ]);

    return rows;
  } catch (error) {
    console.log({ error });

    throw error;
  }
};

module.exports = User;
