const bcrypt = require('bcryptjs');
const { User } = require('../models');

const { constraints } = require('./static');

exports.postLogin = async ({ body }, res, next) => {
  const { username, password } = body;

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);

    // const result = await
  } catch (error) {
    console.log({ error });

    throw error;
  }
};

exports.postSignup = async ({ body }, res, next) => {
  const {
    email, password, username,
  } = body;

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
      username,
    });

    const result = await user.createUser();

    res.send(user);
  } catch (error) {
    const errorToThrow = new Error();

    switch (error?.code) {
      case '23505': {
        errorToThrow.message = `${constraints[error.constraint]} already exists`;
        errorToThrow.statusCode = 403;
        break;
      }
      default:
        errorToThrow.statusCode = 500;
    }

    next(errorToThrow);
  }
};
