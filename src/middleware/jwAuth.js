const jwt = require('jsonwebtoken');
const { jwtConfig } = require('@static/config');
const { db } = require('@models');

const { user: User } = db;

const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(403).send({
      message: 'No token provided',
    });
  }

  jwt.verify(token, jwtConfig.secret, (error, decoded) => {
    if (error) {
      return res.status(401).send({
        message: 'Unauthorized',
      });
    }

    req.userId = decoded.id;
    next();
  });
};

const isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      // roles.forEach(role => {
      //   if (role.name === 'admin') {
      //     next();

      //     return true;
      //   }
      // });
      // res.status(403).send({
      //   message: 'Require Admin Role!',
      // });
      for (let i = 0; i < roles.length; i += 1) {
        if (roles[i].name === 'admin') {
          next();

          return;
        }
      }
      res.status(403).send({
        message: 'Require Admin Role!',
      });
    });
  });
};

module.exports = {
  isAdmin,
  verifyToken,
};
