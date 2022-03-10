const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { db } = require('@models');
const { jwtConfig } = require('@static/config');

const { Op } = db.Sequelize;
const {
  user: User, refreshToken: RefreshToken, role: Role,
} = db;

const signUp = async ({ body }, res) => {
  try {
    await User.beforeCreate(user => {
      const hashedPassword = bcrypt.hashSync(user.password);

      // eslint-disable-next-line no-param-reassign
      user.password = hashedPassword;
    });

    const user = await User.create({
      email: body.email,
      password: body.password,
      roles: body.roles ?? ['user'],
      username: body.username,
    });

    if (body.roles) {
      const roles = await Role.findAll({
        where: {
          name: {
            [Op.or]: body.roles,
          },
        },
      });

      await user.setRoles(roles);

      res.send({
        message: 'auth.userRegisted',
      });
    } else {
      await user.setRoles([0]);

      res.send({
        message: 'auth.userRegistered',
      });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

const signIn = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!user) {
      return res.status(404).send({ message: 'auth.userNotFound' });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: 'auth.invalidCredentials',
      });
    }

    const token = jwt.sign({ id: user.id }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiration,
    });

    const refreshToken = await RefreshToken.createToken(user);
    const userRoles = await user.getRoles();
    const roles = userRoles.map(role => `ROLE_${role.name.toUpperCase()}`);

    res.status(200).send({
      accessToken: token,
      email: user.email,
      id: user.id,
      refreshToken,
      roles,
      username: user.username,
    });

    return true;
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const tokenRefresh = async (req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (requestToken == null) {
    return res.status(403).json({ message: 'auth.refreshTokenRequired' });
  }

  try {
    const refreshToken = await RefreshToken.findOne({ where: { token: requestToken } });

    if (!refreshToken) {
      res.status(403).json({ message: 'auth.nonexistantRefreshToken' });

      return true;
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.destroy({ where: { id: refreshToken.id } });

      res.status(403).json({
        message: 'auth.refreshTokenExpiredReLogin',
      });

      return true;
    }
    const user = await refreshToken.getUser();
    const newAccessToken = jwt.sign({ id: user.id }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiration,
    });

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};

module.exports = {
  signIn,
  signUp,
  tokenRefresh,
};
