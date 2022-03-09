const jwt = require('jsonwebtoken');
const { jwtConfig } = require('@static/config');
const { db } = require('@models');

const { user: User } = db;
const { TokenExpiredError } = jwt;

const catchError = (err, res) => {
  if (err instanceof TokenExpiredError) {
    return res.status(401).send({ message: 'auth.accessTokenExpired' });
  }

  return res.sendStatus(401).send({ message: 'auth.unauthorized!' });
};

const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(403).send({ message: 'auth.noTokenProvided' });
  }

  jwt.verify(token, jwtConfig.secret, (error, decoded) => {
    if (error) {
      return catchError(error, res);
    }

    req.userId = decoded.id;
    next();

    return true;
  });
};

const isAdmin = async ({ userId }, res, next) => {
  const user = await User.findByPk(userId);

  const roles = await user.getRoles();

  for (let i = 0; i < roles.length; i += 1) {
    if (roles[i].name === 'admin') {
      next();

      return;
    }
  }

  res.status(403).send({
    message: 'auth.adminRoleRequired',
  });
};

module.exports = {
  isAdmin,
  verifyToken,
};
