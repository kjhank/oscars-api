const { db } = require('@models');

const { ROLES, user: User } = db;

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  const user = await User.findOne({
    where: {
      username: req.body.username,
    },
  });

  if (user) {
    res.status(400).send({
      message: 'auth.usernameInUse',
    });

    return;
  }

  const value = await User.findOne({
    where: {
      email: req.body.email,
    },
  });

  if (value) {
    res.status(400).send({
      message: 'auth.emailInUse',
    });

    return;
  }
  next();
};

const checkIfRolesExist = (req, res, next) => {
  if (req.body.roles) {
    req.body.roles.forEach(role => {
      if (!ROLES.includes(role)) {
        res.status(400).send({
          message: `Role '${role}' doesn't exist`,
        });
      }
    });
  }

  next();
};

const verifySignup = {
  checkDuplicateUsernameOrEmail,
  checkIfRolesExist,
};

module.exports = { verifySignup };
