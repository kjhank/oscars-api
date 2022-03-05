const { db } = require('@models');

const { ROLES, user: User } = db;

const checkDuplicateUsernameOrEmail = (req, res, next) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then(user => {
      if (user) {
        res.status(400).send({
          message: 'Failed. Username is already in use',
        });

        return;
      }
      User.findOne({
        where: {
          email: req.body.email,
        },
      }).then(value => {
        if (value) {
          res.status(400).send({
            message: 'E-mail already in use',
          });

          return;
        }
        next();
      });
    });
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
